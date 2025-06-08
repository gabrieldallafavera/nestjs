import { Body, Controller, Get, HttpCode, Param, Post, Put } from "@nestjs/common";
import { SignUpDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { AuthService } from "./auth.service";
import { StatusCodes } from "http-status-codes";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post("sign-up")
    @HttpCode(StatusCodes.CREATED)
    signUp(@Body() signUpDto: SignUpDto) {
        this.authService.signUp();
    }

    @Get("forgot-password/:email")
    @HttpCode(StatusCodes.NO_CONTENT)
    forgotPassword(@Param("email") email: string) {
        this.authService.forgotPassword(email);
    }

    @Put("reset-password/:token")
    @HttpCode(StatusCodes.NO_CONTENT)
    resetPassword(@Param("token") token: string) {
        this.authService.resetPassword(token);
    }

    @Put("verify-email/:token")
    @HttpCode(StatusCodes.NO_CONTENT)
    verifyEmail(@Param("token") token: string) {
        this.authService.verifyEmail(token);
    }

    @Post("sign-in")
    @HttpCode(StatusCodes.NO_CONTENT)
    signIn(@Body() signInDto: SignInDto) {
        this.authService.signIn();
    }

    @Post("refresh-token")
    @HttpCode(StatusCodes.NO_CONTENT)
    refreshToken() {
        this.authService.refreshToken();
    }

    @Post("sign-out")
    @HttpCode(StatusCodes.NO_CONTENT)
    signOut() {
        this.authService.signOut();
    }
}