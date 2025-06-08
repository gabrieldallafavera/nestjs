import { Controller, Get, HttpCode } from "@nestjs/common";
import { StatusCodes } from "http-status-codes";

@Controller("ping")
export class PingController {
    @Get()
    @HttpCode(StatusCodes.OK)
    ping(): string {
        return "pong";
    }
}