import { config } from "dotenv";
import { defineConfig } from 'drizzle-kit';

// Load environment variables from .env or .env.local
config({ path: ".env" }); // or ".env.local" if that's your convention

if (!process.env.DATABASE_URL) {
  throw new Error("DIDATABASE_URL is missing");
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/server/db/schema.ts',
  out: './src/lib/server/db',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});