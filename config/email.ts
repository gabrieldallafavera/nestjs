import { Resend } from "resend";
import type { Attachment } from "resend";

const emailSecretKey = process.env.EMAIL_SECRET_KEY || "";
const emailAddress = process.env.EMAIL_ADDRESS || "";

class CustomResend extends Resend {
	async sendTextEmail({
		from = emailAddress,
		...options
	}: { from?: string; to: string | string[]; subject: string; text: string; attachment?: Attachment[] }) {
		return await this.emails.send({ from, ...options });
	}

	async sendHtmlEmail({
		from = emailAddress,
		...options
	}: { from?: string; to: string | string[]; subject: string; html: string; attachment?: Attachment[] }) {
		return await this.emails.send({ from, ...options });
	}
}

export const resend = new CustomResend(emailSecretKey);
