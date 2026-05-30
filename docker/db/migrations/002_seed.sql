-- ============================================================
-- Seed data — mirrors all values previously in lib/data/mock.ts
-- Safe to run multiple times (ON CONFLICT DO NOTHING)
-- ============================================================

-- ------------------------------------------------------------
-- categories
-- ------------------------------------------------------------
INSERT INTO categories (id, name, image_url) VALUES
  ('Fruits',     'Fruits',     'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11'),
  ('Vegetables', 'Vegetables', 'https://images.unsplash.com/photo-1540420773420-3366772f4999'),
  ('Dairy',      'Dairy',      'https://images.unsplash.com/photo-1550583724-b2692b85b150'),
  ('Bakery',     'Bakery',     'https://images.unsplash.com/photo-1608198093002-ad4e005484ec'),
  ('Organic',    'Organic',    'https://images.unsplash.com/photo-1542838132-92c53300491e')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- products
-- ------------------------------------------------------------
INSERT INTO products (id, slug, name, category_id, description, image, price, unit, weight_label, in_stock, stock_level, buffered_stock, nutrition_calories, nutrition_protein, nutrition_carbs, nutrition_fat, discount) VALUES
  ('p1', 'organic-avocado-hass', 'Organic Hass Avocado',      'Fruits',     'Creamy, ripe, and ideal for toast, salads, and guacamole.',               'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad', 4.20,  'kg',     '~250g each',  TRUE,  48,  8, '160 kcal', '2g',    '9g',   '15g',  10),
  ('p2', 'wild-blueberries',     'Wild Blueberries',           'Fruits',     'Naturally sweet berries packed with antioxidants.',                        'https://images.unsplash.com/photo-1498557850523-fd3d118b962e', 7.80,  'kg',     '125g punnet', TRUE,  35,  6, '57 kcal',  '0.7g',  '14g',  '0.3g', NULL),
  ('p3', 'farm-spinach',         'Farm Baby Spinach',          'Vegetables', 'Freshly picked, crisp leaves for green bowls and smoothies.',             'https://images.unsplash.com/photo-1576045057995-568f588f82fb', 5.90,  'kg',     '200g bag',    TRUE,  21,  5, '23 kcal',  '2.9g',  '3.6g', '0.4g', NULL),
  ('p4', 'almond-milk-unsweetened', 'Unsweetened Almond Milk', 'Dairy',      'Barista blend almond milk with silky foam texture.',                      'https://images.unsplash.com/photo-1600788907416-456578634209', 3.40,  'bottle', '1L bottle',   TRUE,  62, 10, '14 kcal',  '0.4g',  '0.2g', '1.2g', NULL),
  ('p5', 'sourdough-loaf',       'Stoneground Sourdough Loaf', 'Bakery',     'Slow-fermented artisan loaf with crisp crust and airy center.',           'https://images.unsplash.com/photo-1549931319-a545dcf3bc73', 6.80,  'pcs',    '650g loaf',   FALSE,  0,  2, '232 kcal', '8g',    '44g',  '2g',   NULL),
  ('p6', 'greek-yogurt',         'Greek Yogurt 2%',            'Dairy',      'Thick, creamy cultured yogurt made from local milk.',                     'https://images.unsplash.com/photo-1488477181946-6428a0291777', 4.90,  'pcs',    '500g tub',    TRUE,  17,  3, '59 kcal',  '10g',   '3.6g', '0.4g', NULL)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- product_gallery
-- ------------------------------------------------------------
INSERT INTO product_gallery (product_id, image_url, position) VALUES
  ('p1', 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad', 0),
  ('p1', 'https://images.unsplash.com/photo-1594282486552-05a594abfc7f', 1),
  ('p1', 'https://images.unsplash.com/photo-1603048719539-9ace5a0e7f58', 2),
  ('p2', 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e', 0),
  ('p2', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6', 1),
  ('p2', 'https://images.unsplash.com/photo-1596591868231-05e0f53a74ff', 2),
  ('p3', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb', 0),
  ('p3', 'https://images.unsplash.com/photo-1576678927484-cc907957088c', 1),
  ('p3', 'https://images.unsplash.com/photo-1615486363972-f79e9a8c7f8c', 2),
  ('p4', 'https://images.unsplash.com/photo-1600788907416-456578634209', 0),
  ('p4', 'https://images.unsplash.com/photo-1559561853-08451507cbe7', 1),
  ('p4', 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4', 2),
  ('p5', 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73', 0),
  ('p5', 'https://images.unsplash.com/photo-1509440159596-0249088772ff', 1),
  ('p5', 'https://images.unsplash.com/photo-1577985051167-0d49eec21977', 2),
  ('p6', 'https://images.unsplash.com/photo-1488477181946-6428a0291777', 0),
  ('p6', 'https://images.unsplash.com/photo-1514996937319-344454492b37', 1),
  ('p6', 'https://images.unsplash.com/photo-1505253213348-cd54c92b37e3', 2);

-- ------------------------------------------------------------
-- product_tags
-- ------------------------------------------------------------
INSERT INTO product_tags (product_id, tag) VALUES
  ('p1', 'Organic'), ('p1', 'Vegan'), ('p1', 'Gluten-Free'), ('p1', 'Dairy-Free'),
  ('p2', 'Organic'), ('p2', 'Vegan'), ('p2', 'Gluten-Free'), ('p2', 'Dairy-Free'),
  ('p3', 'Organic'), ('p3', 'Vegan'), ('p3', 'Gluten-Free'), ('p3', 'Dairy-Free'),
  ('p4', 'Vegan'),   ('p4', 'Gluten-Free'), ('p4', 'Dairy-Free'),
  ('p5', 'Organic'),
  ('p6', 'Gluten-Free')
ON CONFLICT (product_id, tag) DO NOTHING;

-- ------------------------------------------------------------
-- product_alternates
-- ------------------------------------------------------------
INSERT INTO product_alternates (product_id, alternate_id) VALUES
  ('p1', 'p2'),
  ('p1', 'p3'),
  ('p5', 'p6')
ON CONFLICT (product_id, alternate_id) DO NOTHING;

-- ------------------------------------------------------------
-- coupons
-- ------------------------------------------------------------
INSERT INTO coupons (id, code, type, value, min_order_amount, expires_at, active, usage_count, usage_limit) VALUES
  ('c1', 'FRESH10',   'percentage', 10, 20, '2026-07-31', TRUE,  142, 500),
  ('c2', 'SAVE5',     'fixed',       5, 30, '2026-06-30', TRUE,   89, 200),
  ('c3', 'ORGANIC18', 'percentage', 18, 40, '2026-05-31', FALSE, 500, 500)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- employees
-- ------------------------------------------------------------
INSERT INTO employees (id, name, email, role, active, joined_at) VALUES
  ('e1', 'Sarah Mitchell', 'sarah.m@hybridgrocer.com', 'admin', TRUE,  '2024-03-15'),
  ('e2', 'James Okoro',    'james.o@hybridgrocer.com', 'staff', TRUE,  '2024-06-01'),
  ('e3', 'Priya Sharma',   'priya.s@hybridgrocer.com', 'staff', TRUE,  '2025-01-10'),
  ('e4', 'Tom Bauer',      'tom.b@hybridgrocer.com',   'staff', FALSE, '2023-11-20')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- orders
-- ------------------------------------------------------------
INSERT INTO orders (id, customer_name, items_count, total, status, eta, requires_weight_adjustment) VALUES
  ('ORD-2845', 'Lina Berg', 14, 92.30, 'Pending',   '22 min',          TRUE),
  ('ORD-2844', 'Noah Lang',  7, 41.50, 'Picking',   '14 min',          FALSE),
  ('ORD-2843', 'Mia Chen',  11, 67.90, 'Completed', 'Courier assigned', FALSE)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- order_tracking_events  (attached to ORD-2845 as demo)
-- ------------------------------------------------------------
INSERT INTO order_tracking_events (id, order_id, status, time, note) VALUES
  ('t1', 'ORD-2845', 'Pending',   '10:24 AM', 'Order confirmed and queued for store picking'),
  ('t2', 'ORD-2845', 'Picking',   '10:40 AM', 'Picker is selecting fresh produce and weight-based items'),
  ('t3', 'ORD-2845', 'Completed', '11:02 AM', 'All items packed with cold-chain handling')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- stock_damage_alerts
-- ------------------------------------------------------------
INSERT INTO stock_damage_alerts (id, product_id, quantity_damaged, reason, notification_sent, created_at) VALUES
  ('da1', 'p5', 3, 'Water damage from refrigeration leak',    TRUE,  '2026-05-28T09:14:00Z'),
  ('da2', 'p3', 5, 'Delivery van temperature breach',         FALSE, '2026-05-29T07:30:00Z')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- damage_alert_orders
-- ------------------------------------------------------------
INSERT INTO damage_alert_orders (alert_id, order_id) VALUES
  ('da1', 'ORD-2843'),
  ('da2', 'ORD-2842'),
  ('da2', 'ORD-2841')
ON CONFLICT (alert_id, order_id) DO NOTHING;

-- ------------------------------------------------------------
-- promo_cards
-- ------------------------------------------------------------
INSERT INTO promo_cards (title, subtitle, cta, active) VALUES
  ('Green Basket Weekend',  'Save 18% on all organic produce',                'Claim Offer',       TRUE),
  ('Bakery Morning Drop',   'Fresh sourdough and pastries before 9:00',       'Schedule Delivery', TRUE)
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- delivery_slots
-- ------------------------------------------------------------
INSERT INTO delivery_slots (id, label, capacity, available) VALUES
  ('s1', 'Today 6:00 - 8:00 PM',       '3 spots left',  TRUE),
  ('s2', 'Tomorrow 8:00 - 10:00 AM',   '12 spots left', TRUE),
  ('s3', 'Tomorrow 7:00 - 9:00 PM',    'Full',          FALSE)
ON CONFLICT (id) DO NOTHING;
