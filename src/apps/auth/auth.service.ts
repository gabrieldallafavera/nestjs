import { BadRequestException, ForbiddenException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import type { SignInDto } from "./dto/sign-in.dto";
import type { SignUpDto } from "./dto/sign-up.dto";
import { passwordLib } from "src/libs/password.lib";
import { tokenLib } from "src/libs/token.lib";
import { userRepository } from "src/repositories/user.repository";
import { client } from "config/redis";

// const tokenExpiresIn = Number(process.env.TOKEN_EXPIRES_IN);
const tokenExpiresIn = 900;

@Injectable()
export class AuthService {
	async signUp(signUpDto: SignUpDto) {
		const user = await userRepository.find(signUpDto.username);
		if (user) {
			throw new BadRequestException("User already exists");
		}

		const { passwordSalt, passwordHash } = passwordLib.createPasswordHash(signUpDto.password);

		const response = await userRepository.create(
			signUpDto.name,
			signUpDto.username,
			signUpDto.email,
			passwordHash,
			passwordSalt,
		);

		const token = tokenLib.createToken();
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

		const token = tokenLib.createToken();
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

		const { passwordSalt, passwordHash } = passwordLib.createPasswordHash(password);

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

		if (passwordLib.verifyPassword(signInDto.password, user.passwordHash, user.passwordSalt)) {
			throw new UnauthorizedException("Invalid username or password");
		}

		if (!user.verifiedAt) {
			const token = tokenLib.createToken();
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

		const accessToken = tokenLib.createToken();
		const refeshToken = tokenLib.createToken();

		await client.json.set(accessToken, "$", {
			userId: user.id,
			email: user.email,
		});
		await client.expire(accessToken, tokenExpiresIn);
		await client.setEx(refeshToken, tokenExpiresIn * 2, user.id.toString());

		return { accessToken, refeshToken };
	}

	async refreshToken(accessToken: string, refreshToken: string) {
		const userId = await client.get(refreshToken);
		if (!userId) {
			throw new ForbiddenException("Invalid refresh token");
		}

		const user = await userRepository.findById(Number(userId));
		if (!user) {
			throw new UnauthorizedException("Invalid username or password");
		}

		const newAccessToken = tokenLib.createToken();
		const newRefreshToken = tokenLib.createToken();

		await client.del(accessToken);
		await client.del(refreshToken);
		await client.json.set(newAccessToken, "$", {
			userId: user.id,
			email: user.email,
		});
		await client.expire(newAccessToken, tokenExpiresIn);
		await client.setEx(newRefreshToken, tokenExpiresIn * 2, user.id.toString());

		return { newAccessToken, newRefreshToken };
	}

	async signOut(accessToken: string, refreshToken: string) {
		await client.del(accessToken);
		await client.del(refreshToken);
	}
}
