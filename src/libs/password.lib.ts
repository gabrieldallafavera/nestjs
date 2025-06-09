import Crypto from "node:crypto";

export namespace passwordLib {
	export function createPasswordHash(password: string): { passwordHash: Buffer; passwordSalt: Buffer } {
		const hmac = Crypto.createHmac("sha512", Crypto.randomBytes(64));
		const passwordHash = hmac.update(password).digest();
		const passwordSalt = hmac.digest();

		return { passwordHash, passwordSalt };
	}

	export function verifyPassword(password: string, passwordHash: Buffer, passwordSalt: Buffer): boolean {
		const hmac = Crypto.createHmac("sha512", passwordSalt);
		const computedHash = hmac.update(password).digest();
		return computedHash.equals(passwordHash);
	}
}