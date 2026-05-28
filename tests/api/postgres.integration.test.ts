import test from "node:test";
import assert from "node:assert/strict";
import pg from "pg";

const { Client } = pg;

const databaseUrl = process.env.DATABASE_URL;

const requireDatabaseUrl = (t: { skip: (reason?: string) => void }) => {
  if (!databaseUrl) {
    t.skip("DATABASE_URL not set; skipping local postgres integration tests");
    return false;
  }

  return true;
};

test("local database is reachable", async (t) => {
  if (!requireDatabaseUrl(t)) {
    return;
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  const result = await client.query("SELECT 1 as alive");
  await client.end();

  assert.equal(result.rowCount, 1);
  assert.equal(result.rows[0].alive, 1);
});

test("products seed data exists", async (t) => {
  if (!requireDatabaseUrl(t)) {
    return;
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  const result = await client.query("SELECT COUNT(*)::int as count FROM products");
  await client.end();

  assert.ok(result.rows[0].count >= 3);
});

test("buffered stock never exceeds stock level", async (t) => {
  if (!requireDatabaseUrl(t)) {
    return;
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  const result = await client.query(
    "SELECT id, stock_level, buffered_stock FROM products WHERE buffered_stock > stock_level"
  );
  await client.end();

  assert.equal(result.rowCount, 0);
});
