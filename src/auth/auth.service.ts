import { Injectable } from "@nestjs/common";
import type { SignInDto } from "./dto/sign-in.dto";
import type { SignUpDto } from "./dto/sign-up.dto";

@Injectable()
export class AuthService {
	signUp(signUpDto: SignUpDto) {}

	forgotPassword(email: string) {}

	resetPassword(token: string) {}

	verifyEmail(token: string) {}

	signIn(signInDto: SignInDto) {}

	refreshToken() {}

	signOut() {}
}
