import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

import Database from "better-sqlite3";

const sqlite = new Database(path.resolve(process.cwd(), "dev.sqlite"));
const adapter = new PrismaBetterSqlite3(sqlite);

if (process.env.NODE_ENV !== "production") {
  if (!global.prismaGlobal) {
    global.prismaGlobal = new PrismaClient({ adapter });
  }
}

const prisma = global.prismaGlobal ?? new PrismaClient({ adapter });

export default prisma;
