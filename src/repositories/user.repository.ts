import { eq, or } from "drizzle-orm";
import { db } from "config/db";
import { usersTable } from "src/db/schemas/users";

export namespace userRepository {
	export async function create(
		name: string,
		username: string,
		email: string,
		passwordHash: Buffer,
		passwordSalt: Buffer,
	): Promise<{
		id: number;
	}> {
		const user: typeof usersTable.$inferInsert = {
			name,
			username,
			email,
			passwordHash,
			passwordSalt,
		};
		return (await db.insert(usersTable).values(user).returning({ id: usersTable.id }))[0];
	}

	export async function findById(id: number) {
		return (
			await db
				.select({
					id: usersTable.id,
					name: usersTable.name,
					email: usersTable.email,
					verifiedAt: usersTable.verifiedAt,
					passwordHash: usersTable.passwordHash,
					passwordSalt: usersTable.passwordSalt,
				})
				.from(usersTable)
				.where(eq(usersTable.id, id))
		)[0];
	}

	export async function find(value: string) {
		return (
			await db
				.select({
					id: usersTable.id,
					name: usersTable.name,
					email: usersTable.email,
					verifiedAt: usersTable.verifiedAt,
					passwordHash: usersTable.passwordHash,
					passwordSalt: usersTable.passwordSalt,
				})
				.from(usersTable)
				.where(or(eq(usersTable.username, value), eq(usersTable.email, value)))
		)[0];
	}

	export async function setVerifiedAt(id: number) {
		return await db.update(usersTable).set({ verifiedAt: new Date() }).where(eq(usersTable.id, id));
	}

	export async function resetPassword(id: number, passwordHash: Buffer, passwordSalt: Buffer) {
		return await db.update(usersTable).set({ passwordHash, passwordSalt }).where(eq(usersTable.id, id));
	}
}