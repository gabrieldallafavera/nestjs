import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Req, Res, UsePipes } from "@nestjs/common";
import { BindValidationPipe } from "src/pipes/bind-validation.pipe";
import type { AuthService } from "./auth.service";
import { signInDtoSchema } from "./dto/schema/sign-in.schema";
import { signUpDtoSchema } from "./dto/schema/sign-up.schema";
import type { SignInDto } from "./dto/sign-in.dto";
import type { SignUpDto } from "./dto/sign-up.dto";
import { passwordDtoSchema } from './dto/schema/password.schema';
import { PasswordDto } from "./dto/password.dto";
import { Request, Response } from 'express';
import { addSeconds } from "date-fns";

// const tokenExpiresIn = Number(process.env.TOKEN_EXPIRES_IN);
const tokenExpiresIn = 900;

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post("sign-up")
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new BindValidationPipe(signUpDtoSchema))
	async signUp(@Body() signUpDto: SignUpDto) {
		await this.authService.signUp(signUpDto);
	}

	@Get("forgot-password/:email")
	@HttpCode(HttpStatus.NO_CONTENT)
	async forgotPassword(@Param("email") email: string) {
		await this.authService.forgotPassword(email);
	}

	@Put("reset-password/:token")
	@HttpCode(HttpStatus.NO_CONTENT)
	@UsePipes(new BindValidationPipe(passwordDtoSchema))
	async resetPassword(@Param("token") token: string, @Body() passwordDto: PasswordDto) {
		await this.authService.resetPassword(token, passwordDto.password);
	}

	@Put("verify-email/:token")
	@HttpCode(HttpStatus.NO_CONTENT)
	async verifyEmail(@Param("token") token: string) {
		await this.authService.verifyEmail(token);
	}

	@Post("sign-in")
	@HttpCode(HttpStatus.NO_CONTENT)
	@UsePipes(new BindValidationPipe(signInDtoSchema))
	async signIn(@Body() signInDto: SignInDto, @Res() response: Response) {
		const { accessToken, refeshToken } = await this.authService.signIn(signInDto);

		response.cookie("accessToken", accessToken, { httpOnly: true, expires: addSeconds(new Date(), tokenExpiresIn) });
		response.cookie("refreshToken", refeshToken, {
			httpOnly: true,
			expires: addSeconds(new Date(), tokenExpiresIn * 2),
		});
	}

	@Post("refresh-token")
	@HttpCode(HttpStatus.NO_CONTENT)
	async refreshToken(@Req() request: Request, @Res() response: Response) {
		const accessTokenCookie = request.cookies.accessToken;
		const refreshTokenCookie = request.cookies.refreshToken;

		const { newAccessToken, newRefreshToken } = await this.authService.refreshToken(accessTokenCookie, refreshTokenCookie);

		response.cookie("accessToken", newAccessToken, { httpOnly: true, expires: addSeconds(new Date(), tokenExpiresIn) });
		response.cookie("refreshToken", newRefreshToken, {
			httpOnly: true,
			expires: addSeconds(new Date(), tokenExpiresIn * 2),
		});
	}

	@Post("sign-out")
	@HttpCode(HttpStatus.NO_CONTENT)
	async signOut(@Req() request: Request) {
		const accessTokenCookie = request.cookies.accessToken;
		const refreshTokenCookie = request.cookies.refreshToken;

		await this.authService.signOut(accessTokenCookie, refreshTokenCookie);
	}
}
