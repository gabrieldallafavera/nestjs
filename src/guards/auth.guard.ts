import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { Observable } from "rxjs";
import { client } from "../../config/redis";

@Injectable()
export class AuthGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();

		if (!request.headers.authorization) {
			throw new UnauthorizedException("Token not found");
		}

		const token = request.headers.authorization.split(" ")[1];
		if (!token) {
			throw new UnauthorizedException("You are not logged in");
		}

		return client.json.get(token).then((hasSession) => {
			if (!hasSession) {
				throw new ForbiddenException("Token expired");
			}
			return true;
		});
	}
}
