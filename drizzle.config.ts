import { DATABASE_URL } from "@/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./auth-schema.ts"],
  out: "./src/drizzle-migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
