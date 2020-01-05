import { IEmailTemplateService, IUser, ISettingsService, SettingsEnum, ITranslatorService, IEmailService, IStringHelper } from '../../../core';

export class UserActivatedEmailTemplateService implements IEmailTemplateService<IUser> {
	constructor(
		private settingsService: ISettingsService,
		private translatorService: ITranslatorService,
		private emailService: IEmailService,
		private stringHelper: IStringHelper,
	) {

	}

	async subject(user: IUser): Promise<string> {
		const { username, active } = user;
		const activated = username ? 'Activated' : 'Approved';
		const action = active ? activated : 'Deactivated';
		const subject = `Accounts_Email_${ action }_Subject`;
		const siteName = await this.settingsService.getValue(SettingsEnum.SITE_NAME);

		return `[${ siteName }] ${ this.translatorService.translate(subject) }`;
	}

	html(user: IUser): Promise<string> {
		const { username, active } = user;
		const activated = username ? 'Activated' : 'Approved';
		const action = active ? activated : 'Deactivated';

		return Promise.resolve(this.emailService.replace(this.translatorService.translate(`Accounts_Email_${ action }`), {
			name: this.stringHelper.escapeHtml(name),
		}));
	}
}
