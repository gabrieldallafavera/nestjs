import "dotenv/config";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { client } from "../config/db";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(cookieParser());

	await client.connect();
	await app.listen(Number(process.env.PORT));
	Logger.log(`Server listening on: ${process.env.PORT}\n`);
}
bootstrap();
