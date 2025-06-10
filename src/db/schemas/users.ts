import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../custom-types";

export const usersTable = pgTable("users", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 150 }).notNull(),
	username: varchar("username", { length: 50 }).notNull().unique(),
	email: varchar("email", { length: 150 }).notNull().unique(),
	verifiedAt: timestamp("verified_at", { withTimezone: false }),
	passwordHash: bytea("password_hash").notNull(),
	passwordSalt: bytea("password_salt").notNull(),
	createdAt: timestamp("created_at", { withTimezone: false }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: false })
		.defaultNow()
		.$onUpdate(() => new Date()),
	deletedAt: timestamp("deleted_at", { withTimezone: false }),
});
