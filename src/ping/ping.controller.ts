import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";

@Controller("ping")
export class PingController {
	@Get()
	@HttpCode(HttpStatus.OK)
	ping(): string {
		return "pong";
	}
}
