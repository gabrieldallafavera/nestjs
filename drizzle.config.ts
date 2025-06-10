import { defineConfig } from "drizzle-kit";

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbDatabase = process.env.DB_DATABASE;

export default defineConfig({
	out: "./migrations",
	schema: "./src/domain/schemas",
	dialect: "postgresql",
	dbCredentials: {
		url: `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbDatabase}`,
	},
});
