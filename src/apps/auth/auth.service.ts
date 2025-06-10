import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { client } from "../../../config/redis";
import jwt from "jsonwebtoken";
import { userRepository } from "../../repositories/user.repository";
import { passwordHandler } from "../../utils/password";
import { tokenHandler } from "../../utils/token";
import type { SignInDto } from "./dto/sign-in.dto";
import type { SignUpDto } from "./dto/sign-up.dto";

@Injectable()
export class AuthService {
	async signUp(signUpDto: SignUpDto) {
		const user = await userRepository.find(signUpDto.username);
		if (user) {
			throw new BadRequestException("User already exists");
		}

		const { passwordSalt, passwordHash } = passwordHandler.createPasswordHash(signUpDto.password);

		const response = await userRepository.create(
			signUpDto.name,
			signUpDto.username,
			signUpDto.email,
			passwordHash,
			passwordSalt,
		);

		const token = tokenHandler.createSimpleToken();
		client.setEx(token, 30 * 60, response.id.toString());
		// const { error } = await resend.sendHtmlEmail({
		// 	to: request.email,
		// 	subject: i18n.t("emails:verify_email_subject"),
		// 	html: i18n.t("emails:verify_email_body", { token: token }),
		// });

		// if (error) {
		// 	throw new InternalServerErrorException("Error sending email");
		// }
	}

	async forgotPassword(email: string) {
		const user = await userRepository.find(email);
		if (!user) {
			throw new BadRequestException("User not found");
		}

		const token = tokenHandler.createSimpleToken();
		client.setEx(token, 30 * 60, user.id.toString());
		// const { error } = await resend.sendHtmlEmail({
		// 	to: user.email,
		// 	subject: i18n.t("emails:reset_password_subject"),
		// 	html: i18n.t("emails:forgot_password_body", { token: token }),
		// });

		// if (error) {
		// 	throw new InternalServerErrorException("Error sending email");
		// }
	}

	async resetPassword(token: string, password: string) {
		const userId = await client.get(token);
		if (!userId) {
			throw new ForbiddenException("Invalid token");
		}

		const { passwordSalt, passwordHash } = passwordHandler.createPasswordHash(password);

		await userRepository.resetPassword(Number(userId), passwordHash, passwordSalt);
	}

	async verifyEmail(token: string) {
		const userId = await client.get(token);
		if (!userId) {
			throw new ForbiddenException("Invalid token");
		}

		await userRepository.setVerifiedAt(Number(userId));
	}

	async signIn(signInDto: SignInDto) {
		const user = await userRepository.find(signInDto.username);
		if (!user) {
			throw new UnauthorizedException("Invalid username or password");
		}

		if (passwordHandler.verifyPassword(signInDto.password, user.passwordHash, user.passwordSalt)) {
			throw new UnauthorizedException("Invalid username or password");
		}

		if (!user.verifiedAt) {
			const token = tokenHandler.createSimpleToken();
			client.setEx(token, 30 * 60, user.id.toString());
			// const { error } = await resend.sendHtmlEmail({
			// 	to: user.email,
			// 	subject: i18n.t("emails:verify_email_subject"),
			// 	html: i18n.t("emails:verify_email_body", { token: token }),
			// });

			// if (error) {
			// 	throw new InternalServerErrorException("Error sending email");
			// }
			throw new ForbiddenException("User not verified");
		}

		const accessToken = tokenHandler.createJwtToken(user.id);
		const refeshToken = tokenHandler.createJwtRefreshToken(user.id);

		return { accessToken, refeshToken };
	}

	async refreshToken(refreshToken: string) {
		const payload = tokenHandler.verifyJwtRefreshToken(refreshToken);

		if (!payload.sub) {
			throw new UnauthorizedException("Invalid refresh token");
		}

		const newAccessToken = tokenHandler.createJwtToken(Number(payload.sub));
		const newRefreshToken = tokenHandler.createJwtRefreshToken(Number(payload.sub));

		return { newAccessToken, newRefreshToken };
	}

	signOut(token: string) {
		const jwtTokenSecret = process.env.JWT_TOKEN_SECRET;

		jwt.verify(token, jwtTokenSecret, async (error, decoded) => {
			if (!error && decoded) {
				const exp = (decoded as jwt.JwtPayload).exp;
				if (exp) {
					const expTime = exp - Math.floor(Date.now() / 1000);

					await client.setEx(token, expTime, "revoked");
				}
			}
		});
	}
}
