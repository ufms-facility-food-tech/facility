import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import * as schema from "./schema";

// connections will fallback to psql environment variables
// PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
// https://www.postgresql.org/docs/current/libpq-envars.html
// but do no automatically get them from .env files
const connectionOptions = {
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
};

migrate(
  drizzle({
    connection: {
      max: 1,
      ...connectionOptions,
    },
    casing: "snake_case",
  }),
  { migrationsFolder: "./migrations" },
);

const db = drizzle({
  connection: connectionOptions,
  casing: "snake_case",
  schema,
});

await db.execute(sql`CREATE EXTENSION IF NOT EXISTS unaccent;`);

export { db };
