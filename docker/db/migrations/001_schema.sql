-- ============================================================
-- Full schema migration — drops and recreates all tables
-- Safe to run multiple times in a dev environment
-- ============================================================

-- Drop in dependency order
DROP TABLE IF EXISTS damage_alert_orders CASCADE;
DROP TABLE IF EXISTS stock_damage_alerts CASCADE;
DROP TABLE IF EXISTS order_tracking_events CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_alternates CASCADE;
DROP TABLE IF EXISTS product_tags CASCADE;
DROP TABLE IF EXISTS product_gallery CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS promo_cards CASCADE;
DROP TABLE IF EXISTS delivery_slots CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- ============================================================
-- categories
-- ============================================================
CREATE TABLE categories (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  image_url   TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- products
-- ============================================================
CREATE TABLE products (
  id                 TEXT PRIMARY KEY,
  slug               TEXT NOT NULL UNIQUE,
  name               TEXT NOT NULL,
  category_id        TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  description        TEXT NOT NULL DEFAULT '',
  image              TEXT NOT NULL DEFAULT '',
  price              NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  unit               TEXT NOT NULL DEFAULT 'pcs',
  weight_label       TEXT NOT NULL DEFAULT '',
  in_stock           BOOLEAN NOT NULL DEFAULT TRUE,
  stock_level        INTEGER NOT NULL DEFAULT 0 CHECK (stock_level >= 0),
  buffered_stock     INTEGER NOT NULL DEFAULT 0 CHECK (buffered_stock >= 0),
  nutrition_calories TEXT NOT NULL DEFAULT '',
  nutrition_protein  TEXT NOT NULL DEFAULT '',
  nutrition_carbs    TEXT NOT NULL DEFAULT '',
  nutrition_fat      TEXT NOT NULL DEFAULT '',
  discount           INTEGER CHECK (discount IS NULL OR (discount >= 0 AND discount <= 100)),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- product_gallery
-- ============================================================
CREATE TABLE product_gallery (
  id          SERIAL PRIMARY KEY,
  product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  position    INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- product_tags
-- ============================================================
CREATE TABLE product_tags (
  product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag         TEXT NOT NULL,
  PRIMARY KEY (product_id, tag)
);

-- ============================================================
-- product_alternates
-- ============================================================
CREATE TABLE product_alternates (
  product_id   TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  alternate_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, alternate_id)
);

-- ============================================================
-- coupons
-- ============================================================
CREATE TABLE coupons (
  id               TEXT PRIMARY KEY,
  code             TEXT NOT NULL UNIQUE,
  type             TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value            NUMERIC(10,2) NOT NULL CHECK (value >= 0),
  min_order_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  expires_at       DATE NOT NULL,
  active           BOOLEAN NOT NULL DEFAULT TRUE,
  usage_count      INTEGER NOT NULL DEFAULT 0,
  usage_limit      INTEGER NOT NULL DEFAULT 100,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- employees
-- ============================================================
CREATE TABLE employees (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  role       TEXT NOT NULL CHECK (role IN ('admin', 'staff')),
  active     BOOLEAN NOT NULL DEFAULT TRUE,
  joined_at  DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- orders
-- ============================================================
CREATE TABLE orders (
  id                         TEXT PRIMARY KEY,
  customer_name              TEXT NOT NULL,
  items_count                INTEGER NOT NULL DEFAULT 0,
  total                      NUMERIC(10,2) NOT NULL DEFAULT 0,
  status                     TEXT NOT NULL DEFAULT 'Pending',
  eta                        TEXT NOT NULL DEFAULT '',
  requires_weight_adjustment BOOLEAN NOT NULL DEFAULT FALSE,
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- order_tracking_events
-- ============================================================
CREATE TABLE order_tracking_events (
  id         TEXT PRIMARY KEY,
  order_id   TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status     TEXT NOT NULL,
  time       TEXT NOT NULL,
  note       TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- stock_damage_alerts
-- ============================================================
CREATE TABLE stock_damage_alerts (
  id                TEXT PRIMARY KEY,
  product_id        TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity_damaged  INTEGER NOT NULL DEFAULT 1 CHECK (quantity_damaged > 0),
  reason            TEXT NOT NULL DEFAULT '',
  notification_sent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- damage_alert_orders  (which orders are affected by an alert)
-- ============================================================
CREATE TABLE damage_alert_orders (
  alert_id  TEXT NOT NULL REFERENCES stock_damage_alerts(id) ON DELETE CASCADE,
  order_id  TEXT NOT NULL,
  PRIMARY KEY (alert_id, order_id)
);

-- ============================================================
-- promo_cards
-- ============================================================
CREATE TABLE promo_cards (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  subtitle   TEXT NOT NULL DEFAULT '',
  cta        TEXT NOT NULL DEFAULT '',
  active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- delivery_slots
-- ============================================================
CREATE TABLE delivery_slots (
  id         TEXT PRIMARY KEY,
  label      TEXT NOT NULL,
  capacity   TEXT NOT NULL DEFAULT '',
  available  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- customers  (registered shoppers)
-- ============================================================
CREATE TABLE customers (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
