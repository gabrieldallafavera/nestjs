import { HttpException, HttpStatus, Injectable, type NestMiddleware } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";

@Injectable()
export class ErrorHandlerMiddleware implements NestMiddleware {
	use(_req: Request, res: Response, next: NextFunction) {
		try {
			next();
		} catch (error) {
			if (error instanceof HttpException) {
				res.status(error.getStatus()).json({ message: error.message });
				return;
			}

			res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
		}
	}
}
