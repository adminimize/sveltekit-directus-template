import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
// @ts-ignore
import { readFile, writeFile } from "fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, "directus-drizzle", "schema.ts");

let data = await readFile(filePath, "utf8");
data = data.replace(/::character varying/g, "");
data = data.replace(/\.default\(NULL\)/g, "");
await writeFile(filePath, data, "utf8");
console.log("Schema fixed!");