import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/.server/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE || "postgres",
    host: process.env.PGHOST || "localhost",
    port: Number(process.env.PGPORT || 5432),
  },
  casing: "snake_case",
});
