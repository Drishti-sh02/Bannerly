import path from "node:path";
import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const dbPath = path.resolve(process.cwd(), "dev.sqlite");
console.log("Resolved DB path:", dbPath);

const adapter = new PrismaBetterSqlite3({ url: "file:" + dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const count = await prisma.session.count();
    console.log("Session count:", count);
  } catch (err) {
    console.error("Prisma error:", err);
  }
}
main();
