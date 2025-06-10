import { resolve } from "node:path";
import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

dotenv.config({ path: resolve(__dirname, "../.env") });

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbDatabase = process.env.DB_DATABASE;

export const client = new Client({
	// connectionString: `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbDatabase}`,
	connectionString: "postgresql://postgres:123456@localhost:5432/postgres",
});

export const db = drizzle({ client });
