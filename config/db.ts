import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbDatabase = process.env.DB_DATABASE;

export const client = new Client({
	connectionString: `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbDatabase}`,
});

export const db = drizzle({ client });
