import { Database } from "bun:sqlite";

const db = new Database();
const stmt = db.prepare<{ value: string }, [string]>(
  `SELECT * FROM json_tree(?)`
);
const res = stmt.all(await Bun.file("test.json").text());
console.log(res.length);
for (const item of res) {
  console.log(item);
}
