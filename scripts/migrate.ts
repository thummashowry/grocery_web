/**
 * Migration runner — executes all SQL files in docker/db/migrations/ in order.
 *
 * Usage (runs against local docker DB by default):
 *   node --import tsx scripts/migrate.ts
 *
 * Or with a custom DATABASE_URL:
 *   DATABASE_URL=postgresql://... node --import tsx scripts/migrate.ts
 */
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const { Client } = pg;

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://grocery:grocery@localhost:5433/grocery_test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, "..", "docker", "db", "migrations");

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log("Connected to", DATABASE_URL.replace(/:[^@]+@/, ":***@"));

  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const filePath = join(migrationsDir, file);
    const sql = readFileSync(filePath, "utf-8");
    console.log(`Running ${file}…`);
    await client.query(sql);
    console.log(`  ✓ ${file} done`);
  }

  await client.end();
  console.log("Migration complete.");
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
