import path from "node:path";
import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

function getDbPath() {
  const dbUrl = process.env.DATABASE_URL || "file:prisma/dev.sqlite";
  let dbPath = dbUrl.replace(/^file:/, "");
  if (!path.isAbsolute(dbPath)) {
    dbPath = path.resolve(process.cwd(), dbPath);
  }
  return dbPath;
}

const dbPath = getDbPath();
console.log("Resolved DB path:", dbPath);

const adapter = new PrismaBetterSqlite3({ url: "file:" + dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const count = await prisma.session.count();
    console.log("Count:", count);
  } catch (err) {
    console.error("Prisma error:", err);
  }
}
main();
