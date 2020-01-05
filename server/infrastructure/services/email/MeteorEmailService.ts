import { IEmailService, IEmailInput } from '../../../core';
import { sendNoWrap, replace } from '../../../../app/mailer';

export class MeteorEmailService implements IEmailService {
	sendNoWrap(input: IEmailInput): Promise<void> {
		const { to, from, html, subject, headers, replyTo } = input;
		return Promise.resolve(sendNoWrap({
			to,
			from,
			subject,
			html,
			headers,
			replyTo,
		}));
	}

	replace(sentence: string, data: Record<string, any>): Promise<string> {
		return replace(sentence, data);
	}
}
