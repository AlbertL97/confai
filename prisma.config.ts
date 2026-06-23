import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://confai:confai@localhost:5432/confai",
  },
  migrations: {
    path: "prisma/migrations",
  },
});
