import { Module } from "@nestjs/common";
import { AuthModule } from "./apps/auth/auth.module";
import { PingController } from "./apps/ping/ping.controller";

@Module({
	imports: [AuthModule],
	controllers: [PingController],
})
export class AppModule {}
