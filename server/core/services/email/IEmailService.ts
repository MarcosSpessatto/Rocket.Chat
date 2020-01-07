export interface IEmailInput {
	to: string | string[];
	from: string;
	html: string;
	subject: string;
	replyTo?: string;
	headers?: Record<string, string>;
}

export interface IEmailService {
	sendNoWrap(email: IEmailInput): Promise<void>;
	replace(sentence: string, data: Record<string, any>): Promise<string>;
}
