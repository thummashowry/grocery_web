import pg from "pg";

const { Pool } = pg;

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://grocery:grocery@localhost:5433/grocery_test";

// Singleton pool — reused across all server-side calls in a process
let _pool: InstanceType<typeof Pool> | null = null;

export function getDb(): InstanceType<typeof Pool> {
  if (!_pool) {
    _pool = new Pool({ connectionString: DATABASE_URL });
  }
  return _pool;
}
