import type { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { BadGatewayException, Injectable } from "@nestjs/common";
import type { ZodSchema } from "zod";

@Injectable()
export class BindValidationPipe implements PipeTransform {
	constructor(private schema: ZodSchema) {}

	transform(value: unknown, metadata: ArgumentMetadata) {
		try {
			return this.schema.parse(value);
		} catch (error) {
			throw new BadGatewayException("Invalid parameters");
		}
	}
}
