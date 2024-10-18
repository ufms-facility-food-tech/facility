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
    ssl: process.env.NODE_ENV === "production",
  },
  casing: "snake_case",
});
