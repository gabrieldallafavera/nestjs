import { type MiddlewareConsumer, Module } from "@nestjs/common";
import { AuthModule } from "./apps/auth/auth.module";
import { PingController } from "./apps/ping/ping.controller";
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
