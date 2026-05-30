/**
 * Server-side database query helpers.
 * Import these in Server Components and API route handlers.
 * Client components must call the API routes instead.
 */
import { getDb } from "@/lib/db";
import { type Product, type ProductTag } from "@/types/product";
import { type StaffOrder, type TrackingEvent } from "@/types/order";
import { type Coupon, type Employee, type StockDamageAlert } from "@/types/admin";

// ─── helpers ─────────────────────────────────────────────────────────────────

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    category: row.category_id as string,
    description: row.description as string,
    image: row.image as string,
    price: parseFloat(row.price as string),
    unit: row.unit as Product["unit"],
    weightLabel: row.weight_label as string,
    inStock: row.in_stock as boolean,
    stockLevel: row.stock_level as number,
    bufferedStock: row.buffered_stock as number,
    tags: ((row.tags as string[] | null) ?? []) as ProductTag[],
    gallery: ((row.gallery as string[] | null) ?? []),
    nutrition: {
      calories: row.nutrition_calories as string,
      protein: row.nutrition_protein as string,
      carbs: row.nutrition_carbs as string,
      fat: row.nutrition_fat as string,
    },
    alternates: ((row.alternates as string[] | null) ?? []).length > 0
      ? (row.alternates as string[])
      : undefined,
    discount: row.discount != null ? (row.discount as number) : undefined,
  };
}

// Single query that aggregates gallery, tags and alternates via GROUP BY
const PRODUCT_SELECT = `
  SELECT
    p.*,
    COALESCE(
      array_agg(DISTINCT pg_img.image_url ORDER BY pg_img.image_url)
        FILTER (WHERE pg_img.image_url IS NOT NULL),
      '{}'
    ) AS gallery,
    COALESCE(
      array_agg(DISTINCT pt.tag)
        FILTER (WHERE pt.tag IS NOT NULL),
      '{}'
    ) AS tags,
    COALESCE(
      array_agg(DISTINCT pa.alternate_id)
        FILTER (WHERE pa.alternate_id IS NOT NULL),
      '{}'
    ) AS alternates
  FROM products p
  LEFT JOIN product_gallery pg_img ON p.id = pg_img.product_id
  LEFT JOIN product_tags pt        ON p.id = pt.product_id
  LEFT JOIN product_alternates pa  ON p.id = pa.product_id
`;

// ─── products ────────────────────────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  const db = getDb();
  const { rows } = await db.query(
    `${PRODUCT_SELECT} GROUP BY p.id ORDER BY p.created_at`
  );
  return rows.map(rowToProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = getDb();
  const { rows } = await db.query(
    `${PRODUCT_SELECT} WHERE p.slug = $1 GROUP BY p.id`,
    [slug]
  );
  return rows.length ? rowToProduct(rows[0]) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = getDb();
  const { rows } = await db.query(
    `${PRODUCT_SELECT} WHERE p.id = $1 GROUP BY p.id`,
    [id]
  );
  return rows.length ? rowToProduct(rows[0]) : null;
}

export async function createProduct(data: Omit<Product, "id">): Promise<Product> {
  const db = getDb();
  const id = `p${Date.now()}`;
  await db.query(
    `INSERT INTO products
       (id, slug, name, category_id, description, image, price, unit, weight_label,
        in_stock, stock_level, buffered_stock,
        nutrition_calories, nutrition_protein, nutrition_carbs, nutrition_fat, discount)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
    [
      id, data.slug, data.name, data.category, data.description, data.image,
      data.price, data.unit, data.weightLabel,
      data.inStock, data.stockLevel, data.bufferedStock,
      data.nutrition.calories, data.nutrition.protein,
      data.nutrition.carbs, data.nutrition.fat,
      data.discount ?? null,
    ]
  );
  // insert gallery
  if (data.gallery.length) {
    for (let i = 0; i < data.gallery.length; i++) {
      await db.query(
        `INSERT INTO product_gallery (product_id, image_url, position) VALUES ($1,$2,$3)`,
        [id, data.gallery[i], i]
      );
    }
  }
  // insert tags
  for (const tag of data.tags) {
    await db.query(
      `INSERT INTO product_tags (product_id, tag) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
      [id, tag]
    );
  }
  // insert alternates
  for (const altId of data.alternates ?? []) {
    await db.query(
      `INSERT INTO product_alternates (product_id, alternate_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
      [id, altId]
    );
  }
  return (await getProductById(id))!;
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id">>
): Promise<Product | null> {
  const db = getDb();
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  const col = (c: string, v: unknown) => { fields.push(`${c} = $${idx++}`); values.push(v); };

  if (data.slug !== undefined)        col("slug",               data.slug);
  if (data.name !== undefined)        col("name",               data.name);
  if (data.category !== undefined)    col("category_id",        data.category);
  if (data.description !== undefined) col("description",        data.description);
  if (data.image !== undefined)       col("image",              data.image);
  if (data.price !== undefined)       col("price",              data.price);
  if (data.unit !== undefined)        col("unit",               data.unit);
  if (data.weightLabel !== undefined) col("weight_label",       data.weightLabel);
  if (data.inStock !== undefined)     col("in_stock",           data.inStock);
  if (data.stockLevel !== undefined)  col("stock_level",        data.stockLevel);
  if (data.bufferedStock !== undefined) col("buffered_stock",   data.bufferedStock);
  if (data.discount !== undefined)    col("discount",           data.discount ?? null);
  if (data.nutrition) {
    if (data.nutrition.calories !== undefined) col("nutrition_calories", data.nutrition.calories);
    if (data.nutrition.protein  !== undefined) col("nutrition_protein",  data.nutrition.protein);
    if (data.nutrition.carbs    !== undefined) col("nutrition_carbs",    data.nutrition.carbs);
    if (data.nutrition.fat      !== undefined) col("nutrition_fat",      data.nutrition.fat);
  }

  if (fields.length) {
    values.push(id);
    await db.query(
      `UPDATE products SET ${fields.join(", ")} WHERE id = $${idx}`,
      values
    );
  }

  // Replace gallery if provided
  if (data.gallery !== undefined) {
    await db.query(`DELETE FROM product_gallery WHERE product_id = $1`, [id]);
    for (let i = 0; i < data.gallery.length; i++) {
      await db.query(
        `INSERT INTO product_gallery (product_id, image_url, position) VALUES ($1,$2,$3)`,
        [id, data.gallery[i], i]
      );
    }
  }
  // Replace tags if provided
  if (data.tags !== undefined) {
    await db.query(`DELETE FROM product_tags WHERE product_id = $1`, [id]);
    for (const tag of data.tags) {
      await db.query(
        `INSERT INTO product_tags (product_id, tag) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
        [id, tag]
      );
    }
  }
  // Replace alternates if provided
  if (data.alternates !== undefined) {
    await db.query(`DELETE FROM product_alternates WHERE product_id = $1`, [id]);
    for (const altId of data.alternates) {
      await db.query(
        `INSERT INTO product_alternates (product_id, alternate_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
        [id, altId]
      );
    }
  }

  return getProductById(id);
}

export async function deleteProduct(id: string): Promise<void> {
  await getDb().query(`DELETE FROM products WHERE id = $1`, [id]);
}

// ─── categories ──────────────────────────────────────────────────────────────

export type Category = { id: string; name: string; imageUrl: string };

export async function getAllCategories(): Promise<Category[]> {
  const { rows } = await getDb().query(
    `SELECT id, name, image_url FROM categories ORDER BY name`
  );
  return rows.map((r) => ({ id: r.id, name: r.name, imageUrl: r.image_url }));
}

export async function createCategory(name: string, imageUrl = ""): Promise<Category> {
  const id = name.trim();
  await getDb().query(
    `INSERT INTO categories (id, name, image_url) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`,
    [id, name.trim(), imageUrl]
  );
  return { id, name: name.trim(), imageUrl };
}

export async function deleteCategory(id: string): Promise<void> {
  await getDb().query(`DELETE FROM categories WHERE id = $1`, [id]);
}

// ─── promo cards ─────────────────────────────────────────────────────────────

export type PromoCard = { title: string; subtitle: string; cta: string };

export async function getPromoCards(): Promise<PromoCard[]> {
  const { rows } = await getDb().query(
    `SELECT title, subtitle, cta FROM promo_cards WHERE active = TRUE ORDER BY id`
  );
  return rows as PromoCard[];
}

// ─── delivery slots ──────────────────────────────────────────────────────────

export type DeliverySlot = { id: string; label: string; capacity: string; available: boolean };

export async function getDeliverySlots(): Promise<DeliverySlot[]> {
  const { rows } = await getDb().query(
    `SELECT id, label, capacity, available FROM delivery_slots ORDER BY id`
  );
  return rows as DeliverySlot[];
}

// ─── coupons ─────────────────────────────────────────────────────────────────

function rowToCoupon(r: Record<string, unknown>): Coupon {
  return {
    id:              r.id as string,
    code:            r.code as string,
    type:            r.type as Coupon["type"],
    value:           parseFloat(r.value as string),
    minOrderAmount:  parseFloat(r.min_order_amount as string),
    expiresAt:       (r.expires_at as Date).toISOString().slice(0, 10),
    active:          r.active as boolean,
    usageCount:      r.usage_count as number,
    usageLimit:      r.usage_limit as number,
  };
}

export async function getAllCoupons(): Promise<Coupon[]> {
  const { rows } = await getDb().query(
    `SELECT * FROM coupons ORDER BY created_at`
  );
  return rows.map(rowToCoupon);
}

export async function createCoupon(data: Omit<Coupon, "id" | "usageCount">): Promise<Coupon> {
  const id = `c${Date.now()}`;
  await getDb().query(
    `INSERT INTO coupons (id,code,type,value,min_order_amount,expires_at,active,usage_limit)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [id, data.code, data.type, data.value, data.minOrderAmount, data.expiresAt, data.active, data.usageLimit]
  );
  return (await getCouponById(id))!;
}

export async function getCouponById(id: string): Promise<Coupon | null> {
  const { rows } = await getDb().query(`SELECT * FROM coupons WHERE id = $1`, [id]);
  return rows.length ? rowToCoupon(rows[0]) : null;
}

export async function updateCoupon(id: string, data: Partial<Omit<Coupon, "id">>): Promise<Coupon | null> {
  const db = getDb();
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;
  const col = (c: string, v: unknown) => { fields.push(`${c} = $${idx++}`); values.push(v); };

  if (data.code            !== undefined) col("code",             data.code);
  if (data.type            !== undefined) col("type",             data.type);
  if (data.value           !== undefined) col("value",            data.value);
  if (data.minOrderAmount  !== undefined) col("min_order_amount", data.minOrderAmount);
  if (data.expiresAt       !== undefined) col("expires_at",       data.expiresAt);
  if (data.active          !== undefined) col("active",           data.active);
  if (data.usageCount      !== undefined) col("usage_count",      data.usageCount);
  if (data.usageLimit      !== undefined) col("usage_limit",      data.usageLimit);

  if (fields.length) {
    values.push(id);
    await db.query(`UPDATE coupons SET ${fields.join(", ")} WHERE id = $${idx}`, values);
  }
  return getCouponById(id);
}

export async function deleteCoupon(id: string): Promise<void> {
  await getDb().query(`DELETE FROM coupons WHERE id = $1`, [id]);
}

// ─── employees ───────────────────────────────────────────────────────────────

function rowToEmployee(r: Record<string, unknown>): Employee {
  return {
    id:       r.id as string,
    name:     r.name as string,
    email:    r.email as string,
    role:     r.role as Employee["role"],
    active:   r.active as boolean,
    joinedAt: (r.joined_at as Date).toISOString().slice(0, 10),
  };
}

export async function getAllEmployees(): Promise<Employee[]> {
  const { rows } = await getDb().query(
    `SELECT * FROM employees ORDER BY joined_at`
  );
  return rows.map(rowToEmployee);
}

export async function createEmployee(
  data: Omit<Employee, "id"> & { password?: string }
): Promise<Employee> {
  const id = `e${Date.now()}`;
  const password = data.password ?? "staff123";
  await getDb().query(
    `INSERT INTO employees (id,name,email,role,active,joined_at,password_hash)
     VALUES ($1,$2,$3,$4,$5,$6, crypt($7, gen_salt('bf')))`,
    [id, data.name, data.email, data.role, data.active, data.joinedAt, password]
  );
  return (await getEmployeeById(id))!;
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
  const { rows } = await getDb().query(`SELECT * FROM employees WHERE id = $1`, [id]);
  return rows.length ? rowToEmployee(rows[0]) : null;
}

export async function updateEmployee(
  id: string,
  data: Partial<Omit<Employee, "id">> & { password?: string }
): Promise<Employee | null> {
  const db = getDb();
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;
  const col = (c: string, v: unknown) => { fields.push(`${c} = $${idx++}`); values.push(v); };

  if (data.name     !== undefined) col("name",      data.name);
  if (data.email    !== undefined) col("email",      data.email);
  if (data.role     !== undefined) col("role",       data.role);
  if (data.active   !== undefined) col("active",     data.active);
  if (data.joinedAt !== undefined) col("joined_at",  data.joinedAt);

  if (fields.length) {
    values.push(id);
    await db.query(`UPDATE employees SET ${fields.join(", ")} WHERE id = $${idx}`, values);
  }

  // Update password separately (uses pgcrypto crypt — can't be done via parameterised SET list)
  if (data.password) {
    await db.query(
      `UPDATE employees SET password_hash = crypt($1, gen_salt('bf')) WHERE id = $2`,
      [data.password, id]
    );
  }

  return getEmployeeById(id);
}

export async function deleteEmployee(id: string): Promise<void> {
  await getDb().query(`DELETE FROM employees WHERE id = $1`, [id]);
}

// ─── orders ──────────────────────────────────────────────────────────────────

function rowToOrder(r: Record<string, unknown>): StaffOrder {
  return {
    id:                       r.id as string,
    customerName:             r.customer_name as string,
    items:                    r.items_count as number,
    total:                    parseFloat(r.total as string),
    status:                   r.status as StaffOrder["status"],
    eta:                      r.eta as string,
    requiresWeightAdjustment: r.requires_weight_adjustment as boolean,
  };
}

export async function getAllOrders(): Promise<StaffOrder[]> {
  const { rows } = await getDb().query(
    `SELECT * FROM orders ORDER BY created_at DESC`
  );
  return rows.map(rowToOrder);
}

export async function updateOrderStatus(id: string, status: string): Promise<StaffOrder | null> {
  await getDb().query(`UPDATE orders SET status = $1 WHERE id = $2`, [status, id]);
  const { rows } = await getDb().query(`SELECT * FROM orders WHERE id = $1`, [id]);
  return rows.length ? rowToOrder(rows[0]) : null;
}

// ─── order items ─────────────────────────────────────────────────────────────

export type OrderItem = {
  id: number;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  weightLabel: string;
  picked: boolean;
};

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const { rows } = await getDb().query(
    `SELECT oi.id, oi.product_id, oi.quantity, oi.unit_price, oi.picked,
            p.name AS product_name, p.image AS product_image,
            p.unit, p.weight_label
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1
     ORDER BY oi.id`,
    [orderId]
  );
  return rows.map((r) => ({
    id:           r.id as number,
    productId:    r.product_id as string,
    productName:  r.product_name as string,
    productImage: r.product_image as string,
    quantity:     parseFloat(r.quantity as string),
    unitPrice:    parseFloat(r.unit_price as string),
    unit:         r.unit as string,
    weightLabel:  r.weight_label as string,
    picked:       r.picked as boolean,
  }));
}

export async function toggleOrderItemPicked(itemId: number, picked: boolean): Promise<void> {
  await getDb().query(
    `UPDATE order_items SET picked = $1 WHERE id = $2`,
    [picked, itemId]
  );
}

// ─── tracking events ─────────────────────────────────────────────────────────

export async function getTrackingEvents(orderId: string): Promise<TrackingEvent[]> {
  const { rows } = await getDb().query(
    `SELECT id, status, time, note FROM order_tracking_events WHERE order_id = $1 ORDER BY created_at`,
    [orderId]
  );
  return rows as TrackingEvent[];
}

// ─── stock damage alerts ─────────────────────────────────────────────────────

async function rowToAlert(r: Record<string, unknown>): Promise<StockDamageAlert> {
  const { rows } = await getDb().query(
    `SELECT order_id FROM damage_alert_orders WHERE alert_id = $1`,
    [r.id]
  );
  return {
    id:               r.id as string,
    productId:        r.product_id as string,
    productName:      r.product_name as string,
    quantityDamaged:  r.quantity_damaged as number,
    reason:           r.reason as string,
    affectedOrderIds: rows.map((x) => x.order_id),
    notificationSent: r.notification_sent as boolean,
    createdAt:        (r.created_at as Date).toISOString(),
  };
}

export async function getAllStockAlerts(): Promise<StockDamageAlert[]> {
  const { rows } = await getDb().query(`
    SELECT sda.*, p.name AS product_name
    FROM stock_damage_alerts sda
    JOIN products p ON p.id = sda.product_id
    ORDER BY sda.created_at DESC
  `);
  return Promise.all(rows.map(rowToAlert));
}

export async function createStockAlert(data: {
  productId: string;
  quantityDamaged: number;
  reason: string;
  affectedOrderIds: string[];
}): Promise<StockDamageAlert> {
  const id = `da${Date.now()}`;
  await getDb().query(
    `INSERT INTO stock_damage_alerts (id, product_id, quantity_damaged, reason)
     VALUES ($1,$2,$3,$4)`,
    [id, data.productId, data.quantityDamaged, data.reason]
  );
  for (const ordId of data.affectedOrderIds) {
    await getDb().query(
      `INSERT INTO damage_alert_orders (alert_id, order_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
      [id, ordId]
    );
  }
  const { rows } = await getDb().query(`
    SELECT sda.*, p.name AS product_name
    FROM stock_damage_alerts sda
    JOIN products p ON p.id = sda.product_id
    WHERE sda.id = $1`, [id]);
  return rowToAlert(rows[0]);
}

export async function markAlertNotified(id: string): Promise<void> {
  await getDb().query(
    `UPDATE stock_damage_alerts SET notification_sent = TRUE WHERE id = $1`,
    [id]
  );
}
