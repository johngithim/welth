import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import { db } from "@/lib/prisma";
import * as url from "node:url";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
