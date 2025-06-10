import {
	Body,
	Controller,
	Get,
	Headers,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Req,
	Res,
	UsePipes,
} from "@nestjs/common";
import { addSeconds } from "date-fns";
import type { Request, Response } from "express";
import { BindValidationPipe } from "../../pipes/bind-validation.pipe";
import { AuthService } from "./auth.service";
import type { PasswordDto } from "./dto/password.dto";
import { passwordDtoSchema } from "./dto/schema/password.schema";
import { signInDtoSchema } from "./dto/schema/sign-in.schema";
import { signUpDtoSchema } from "./dto/schema/sign-up.schema";
import type { SignInDto } from "./dto/sign-in.dto";
import type { SignUpDto } from "./dto/sign-up.dto";

const jwtExpiration = Number(process.env.JWT_EXPIRATION);

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

		response.cookie("accessToken", accessToken, { httpOnly: true, expires: addSeconds(new Date(), jwtExpiration) });
		response.cookie("refreshToken", refeshToken, {
			httpOnly: true,
			expires: addSeconds(new Date(), jwtExpiration * 2),
		});
	}

	@Post("refresh-token")
	@HttpCode(HttpStatus.NO_CONTENT)
	async refreshToken(@Req() request: Request, @Res() response: Response) {
		const refreshToken = request.cookies.refreshToken;

		const { newAccessToken, newRefreshToken } = await this.authService.refreshToken(refreshToken);

		response.cookie("accessToken", newAccessToken, { httpOnly: true, expires: addSeconds(new Date(), jwtExpiration) });
		response.cookie("refreshToken", newRefreshToken, {
			httpOnly: true,
			expires: addSeconds(new Date(), jwtExpiration * 2),
		});
	}

	@Post("sign-out")
	@HttpCode(HttpStatus.NO_CONTENT)
	async signOut(@Headers("authorization") authorization: string, @Res() response: Response) {
		if (!authorization) {
			response.status(HttpStatus.BAD_REQUEST).json({ message: "Token not found" });
			return;
		}

		this.authService.signOut(authorization.split(" ")[1]);

		response.clearCookie("accessToken");
		response.clearCookie("refreshToken");
	}
}
