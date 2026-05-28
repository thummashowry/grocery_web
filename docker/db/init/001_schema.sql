CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  stock_level INTEGER NOT NULL CHECK (stock_level >= 0),
  buffered_stock INTEGER NOT NULL CHECK (buffered_stock >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO products (name, stock_level, buffered_stock)
VALUES
  ('Organic Hass Avocado', 48, 8),
  ('Wild Blueberries', 35, 6),
  ('Farm Baby Spinach', 21, 5)
ON CONFLICT DO NOTHING;
