import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";

const jwtTokenSecret = process.env.JWT_TOKEN_SECRET;
const jwtRefreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
const jwtExpiration = process.env.JWT_EXPIRATION;

export namespace tokenHandler {
	export function createJwtToken(userId: number) {
		return jwt.sign({ sub: userId }, jwtTokenSecret, {
			expiresIn: Number(jwtExpiration),
		});
	}

	export function createJwtRefreshToken(userId: number) {
		return jwt.sign({ sub: userId }, jwtRefreshTokenSecret, {
			expiresIn: Number(jwtExpiration) + Number(jwtExpiration),
		});
	}

	export function verifyJwtToken(token: string) {
		return jwt.verify(token, jwtTokenSecret);
	}

	export function verifyJwtRefreshToken(refreshToken: string) {
		return jwt.verify(refreshToken, jwtRefreshTokenSecret);
	}

	export function createSimpleToken() {
		return randomUUID().toString();
	}
}
