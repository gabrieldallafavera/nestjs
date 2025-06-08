import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
	signUp(/* signUp: SignUp */) {}

	forgotPassword(email: string) {
		console.log(email);
	}

	resetPassword(token: string) {}

	verifyEmail(token: string) {}

	signIn(/* signIn: SignIn */) {}

	refreshToken() {}

	signOut() {}
}
