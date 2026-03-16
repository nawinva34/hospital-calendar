import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.GO_DATABASE_URL || process.env.DATABASE_URL,
  },
});
