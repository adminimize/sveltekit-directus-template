import * as schema from '$lib/server/db/schema';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "dotenv";

config({ path: ".env" });

const connectionString = process.env.DIRECTUS_DIRECT_URL;
if (!connectionString) throw new Error("DIRECTUS_DIRECT_URL is missing");

const pool = new Pool({ connectionString });
export const directus = drizzle(pool, { schema });