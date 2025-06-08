import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, UsePipes } from "@nestjs/common";
import { BindValidationPipe } from "pipes/bind-validation.pipe";
import type { AuthService } from "./auth.service";
import { signInDtoSchema } from "./dto/schema/sign-in.schema";
import { signUpDtoSchema } from "./dto/schema/sign-up.schema";
import type { SignInDto } from "./dto/sign-in.dto";
import type { SignUpDto } from "./dto/sign-up.dto";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post("sign-up")
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new BindValidationPipe(signUpDtoSchema))
	signUp(@Body() signUpDto: SignUpDto) {
		this.authService.signUp(signUpDto);
	}

	@Get("forgot-password/:email")
	@HttpCode(HttpStatus.NO_CONTENT)
	forgotPassword(@Param("email") email: string) {
		this.authService.forgotPassword(email);
	}

	@Put("reset-password/:token")
	@HttpCode(HttpStatus.NO_CONTENT)
	resetPassword(@Param("token") token: string) {
		this.authService.resetPassword(token);
	}

	@Put("verify-email/:token")
	@HttpCode(HttpStatus.NO_CONTENT)
	verifyEmail(@Param("token") token: string) {
		this.authService.verifyEmail(token);
	}

	@Post("sign-in")
	@HttpCode(HttpStatus.NO_CONTENT)
	@UsePipes(new BindValidationPipe(signInDtoSchema))
	signIn(@Body() signInDto: SignInDto) {
		this.authService.signIn(signInDto);
	}

	@Post("refresh-token")
	@HttpCode(HttpStatus.NO_CONTENT)
	refreshToken() {
		this.authService.refreshToken();
	}

	@Post("sign-out")
	@HttpCode(HttpStatus.NO_CONTENT)
	signOut() {
		this.authService.signOut();
	}
}
