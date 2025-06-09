import { randomUUID } from "node:crypto";

export namespace tokenLib {
	export function createToken() {
		return randomUUID().toString();
	}
}