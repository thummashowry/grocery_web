import test from "node:test";
import assert from "node:assert/strict";
import { createAnonClient, createServiceClient, hasSupabaseEnv } from "../fixtures/supabase-fixture";

const requireSupabaseEnv = (t: { skip: (reason?: string) => void }) => {
  if (!hasSupabaseEnv()) {
    t.skip("Supabase env vars not set; skipping API integration suite");
    return false;
  }

  return true;
};

test("Supabase env is configured for integration tests", (t) => {
  if (!requireSupabaseEnv(t)) {
    return;
  }

  assert.equal(typeof process.env.NEXT_PUBLIC_SUPABASE_URL, "string");
  assert.equal(typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "string");
  assert.equal(typeof process.env.SUPABASE_SERVICE_ROLE_KEY, "string");
});

test("Anon API can reach PostgREST health endpoint", async (t) => {
  if (!requireSupabaseEnv(t)) {
    return;
  }

  const anon = createAnonClient();
  const { error } = await anon.from("products").select("id", { count: "exact", head: true });

  assert.equal(error, null, error?.message);
});

test("Service role can query products table", async (t) => {
  if (!requireSupabaseEnv(t)) {
    return;
  }

  const service = createServiceClient();
  const { error, data } = await service.from("products").select("id").limit(1);

  assert.equal(error, null, error?.message);
  assert.ok(Array.isArray(data));
});

test("Buffered stock rule is respected in query shape", async (t) => {
  if (!requireSupabaseEnv(t)) {
    return;
  }

  const service = createServiceClient();

  const { error, data } = await service
    .from("products")
    .select("id, stock_level, buffered_stock")
    .limit(20);

  assert.equal(error, null, error?.message);
  assert.ok(Array.isArray(data));

  for (const row of data as Array<{ stock_level: number; buffered_stock: number }>) {
    assert.ok(row.stock_level >= 0);
    assert.ok(row.buffered_stock >= 0);
    assert.ok(row.stock_level >= row.buffered_stock, "stock should not be below buffered stock");
  }
});
