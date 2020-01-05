import { UserNotFound, PermissionDenied } from '../../exceptions';
import { IUsersRepository, ISubscriptionsRepository } from '../../repositories';
import { IUseCase } from '../IUseCase';
import { IUser, PermissionsEnum, SettingsEnum } from '../../domain';
import { ISettingsService, IAuthorizationService, IEmailTemplateService, IEmailService } from '../../services';

interface IInput {
	userId: string;
	userIdWhoExecuteTheAction: string;
	active: boolean;
}

export class SetUserActiveStatus implements IUseCase<IInput, Promise<void>> {
	constructor(
		private usersRepository: IUsersRepository,
		private subscriptionsRepository: ISubscriptionsRepository,
		private authorizationService: IAuthorizationService,
		private settingsService: ISettingsService,
		private emailTemplateService: IEmailTemplateService<IUser>,
		private emailService: IEmailService,
	) {
	}

	private async archiveSubscriptionIfNeeded(username: string | undefined, active: boolean): Promise<void> {
		if (username) {
			await this.subscriptionsRepository.setArchivedByUsername(username, !active);
		}
	}

	private async cleanupUserActivationData(userId: string, active: boolean): Promise<void> {
		if (!active) {
			await this.usersRepository.unsetLoginTokensById(userId);
		} else {
			await this.usersRepository.unsetReasonById(userId);
		}
	}

	async execute(input: IInput): Promise<void> {
		const { userId, active, userIdWhoExecuteTheAction } = input;
		const user = await this.usersRepository.findOneById(userId);
		if (!user) {
			throw new UserNotFound(userId);
		}
		const updateOwnStatus = userIdWhoExecuteTheAction === user._id;
		if (!updateOwnStatus && !await this.authorizationService.hasPermission(userIdWhoExecuteTheAction, PermissionsEnum.EDIT_OTHER_USER_ACTIVE_STATUS)) {
			throw new PermissionDenied();
		}
		await this.usersRepository.setUserActiveById(userId, active);
		await this.archiveSubscriptionIfNeeded(user.username, active);
		await this.cleanupUserActivationData(userId, active);

		const doesNotNeedSendEmailWhenActivate = active && !await this.settingsService.getValue(SettingsEnum.ACCOUNTS_SEND_EMAIL_WHEN_ACTIVATING);
		const doesNotNeedSendEmailWhenDeactivate = !active && !await this.settingsService.getValue(SettingsEnum.ACCOUNTS_SEND_EMAIL_WHEN_DEACTIVATING);

		if (!Array.isArray(user.emails) || doesNotNeedSendEmailWhenActivate || doesNotNeedSendEmailWhenDeactivate) {
			return;
		}

		const destinations: string[] = user.emails.map((email) => `${ user.name || user.username }<${ email.address }>`);

		const email = {
			to: destinations,
			from: await this.settingsService.getValue(SettingsEnum.FROM_EMAIL),
			subject: await this.emailTemplateService.subject({ ...user, active }),
			html: await this.emailTemplateService.html({ ...user, active }),
		};
		this.emailService.sendNoWrap(email);
	}
}
