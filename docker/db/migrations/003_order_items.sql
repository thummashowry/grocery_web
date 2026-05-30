CREATE TABLE IF NOT EXISTS order_items (
  id          SERIAL PRIMARY KEY,
  order_id    TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity    NUMERIC(8,3) NOT NULL DEFAULT 1,
  unit_price  NUMERIC(10,2) NOT NULL,
  picked      BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO order_items (order_id, product_id, quantity, unit_price, picked) VALUES
  ('ORD-2845', 'p1', 2,   4.20, FALSE),
  ('ORD-2845', 'p2', 1,   7.80, FALSE),
  ('ORD-2845', 'p3', 1.5, 5.90, FALSE),
  ('ORD-2845', 'p6', 3,   4.90, FALSE),
  ('ORD-2844', 'p4', 2,   3.40, TRUE),
  ('ORD-2844', 'p5', 1,   6.80, FALSE),
  ('ORD-2844', 'p6', 1,   4.90, TRUE),
  ('ORD-2843', 'p1', 1,   4.20, TRUE),
  ('ORD-2843', 'p2', 2,   7.80, TRUE),
  ('ORD-2843', 'p3', 1,   5.90, TRUE),
  ('ORD-2843', 'p4', 1,   3.40, TRUE)
ON CONFLICT DO NOTHING;
