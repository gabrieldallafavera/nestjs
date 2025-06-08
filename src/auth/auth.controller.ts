import { Body, Controller, Get, HttpCode, Param, Post, Put } from "@nestjs/common";
import { SignUpDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { AuthService } from "./auth.service";
import { StatusCodes } from "http-status-codes";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post()
    @HttpCode(StatusCodes.CREATED)
    signUp(@Body() signUpDto: SignUpDto) {
        this.authService.signUp();
    }

    @Get(":email")
    @HttpCode(StatusCodes.NO_CONTENT)
    forgotPassword(@Param("email") email: string) {
        this.authService.forgotPassword(email);
    }

    @Put(":token")
    @HttpCode(StatusCodes.NO_CONTENT)
    resetPassword(@Param("token") token: string) {
        console.log(token);
    }

    @Put(":token")
    @HttpCode(StatusCodes.NO_CONTENT)
    verifyEmail(@Param("token") token: string) {

    }

    @Post()
    @HttpCode(StatusCodes.NO_CONTENT)
    signIn(@Body() signInDto: SignInDto) {

    }

    @Post()
    @HttpCode(StatusCodes.NO_CONTENT)
    refreshToken() {

    }

    @Post()
    @HttpCode(StatusCodes.NO_CONTENT)
    signOut() {

    }
}