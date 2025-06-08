import { type MiddlewareConsumer, Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PingController } from "./ping/ping.controller";
import { ErrorHandlerMiddleware } from "./middlewares/error-handler.middleware";

@Module({
	imports: [AuthModule],
	controllers: [PingController],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(ErrorHandlerMiddleware).forRoutes("*");
	}
}
