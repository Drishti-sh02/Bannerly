import Database from "better-sqlite3";

const db = new Database('dev.sqlite');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log("Tables in dev.sqlite:", tables);

const dbPrisma = new Database('prisma/dev.sqlite');
const tablesPrisma = dbPrisma.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log("Tables in prisma/dev.sqlite:", tablesPrisma);
