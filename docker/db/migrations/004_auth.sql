-- Enable pgcrypto for bcrypt hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add password_hash to employees
ALTER TABLE employees ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add password_hash to customers
ALTER TABLE customers ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Set initial passwords for seeded employees (bcrypt via pgcrypto)
-- admin@hybridgrocer.com  → admin123
-- james.o / priya.s / tom.b  → staff123
UPDATE employees SET password_hash = crypt('admin123', gen_salt('bf')) WHERE email = 'admin@hybridgrocer.com';
UPDATE employees SET password_hash = crypt('admin123', gen_salt('bf')) WHERE email = 'sarah.m@hybridgrocer.com';
UPDATE employees SET password_hash = crypt('staff123', gen_salt('bf')) WHERE email IN (
  'james.o@hybridgrocer.com',
  'priya.s@hybridgrocer.com',
  'tom.b@hybridgrocer.com'
);
