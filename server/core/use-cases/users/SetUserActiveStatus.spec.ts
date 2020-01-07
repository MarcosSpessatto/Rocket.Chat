import { PermissionDenied } from '../../exceptions/permissions/PermissionDenied';
import { SetUserActiveStatus } from './SetUserActiveStatus';
import { UserNotFound } from '../../exceptions/users/UserNotFound';
import {
	usersRepositoryMock,
	subscriptionsRepositoryMock,
	authorizationServiceMock,
	settingsServiceMock,
	emailTemplateServiceMock,
	emailServiceMock,
} from '../../../../tests/utils/stubs';

describe('SetUserActiveStatus - UseCase', () => {
	let setUserActiveStatus: SetUserActiveStatus;
	const input = {
		userId: '1',
		userIdWhoExecuteTheAction: '2',
		active: true,
	};

	beforeAll(() => {
		setUserActiveStatus = new SetUserActiveStatus(
			usersRepositoryMock,
			subscriptionsRepositoryMock,
			authorizationServiceMock,
			settingsServiceMock,
			emailTemplateServiceMock,
			emailServiceMock,
		);
	});

	afterEach(() => {
		usersRepositoryMock.findOneById.mockClear();
		authorizationServiceMock.hasPermission.mockClear();
		settingsServiceMock.getValue.mockClear();
		emailTemplateServiceMock.subject.mockClear();
		emailTemplateServiceMock.html.mockClear();
	});

	describe('#execute()', () => {
		it('should return an UserNotFound exception when the user was not found', async () => {
			usersRepositoryMock.findOneById.mockReturnValueOnce(undefined);
			await expect(setUserActiveStatus.execute(input)).rejects.toThrowError(UserNotFound);
		});
		it('should return a PermissionDenied exception when the user is trying update status of another user and does not have the necessary permission', async () => {
			usersRepositoryMock.findOneById.mockReturnValueOnce({ _id: '3' });
			authorizationServiceMock.hasPermission.mockReturnValueOnce(false);
			await expect(setUserActiveStatus.execute(input)).rejects.toThrowError(PermissionDenied);
		});
		it('should NOT return a PermissionDenied exception when the user is trying update status of your own user and does not have the necessary permission', async () => {
			usersRepositoryMock.findOneById.mockReturnValueOnce({ _id: '2' });
			authorizationServiceMock.hasPermission.mockReturnValueOnce(false);
			await expect(setUserActiveStatus.execute(input)).resolves.not.toThrowError(PermissionDenied);
		});
		it('should set the user as active when the user is setting the user to ACTIVE', async () => {
			usersRepositoryMock.findOneById.mockReturnValueOnce({ _id: '2' });
			await setUserActiveStatus.execute(input);
			expect(usersRepositoryMock.setUserActiveById).toBeCalledWith(input.userId, input.active);
		});
		it('should set the subscriptions archived when the user does have a username', async () => {
			usersRepositoryMock.findOneById.mockReturnValueOnce({ _id: '2', username: 'username' });
			await setUserActiveStatus.execute(input);
			expect(subscriptionsRepositoryMock.setArchivedByUsername).toBeCalledWith('username', !input.active);
		});
		it('should unset the logins tokens when the user is setting the status to INACTIVE', async () => {
			usersRepositoryMock.findOneById.mockReturnValueOnce({ _id: '2' });
			await setUserActiveStatus.execute({ ...input, active: false });
			expect(usersRepositoryMock.unsetLoginTokensById).toBeCalledWith(input.userId);
		});
		it('should unset the reason when the user is setting the status to ACTIVE', async () => {
			usersRepositoryMock.findOneById.mockReturnValueOnce({ _id: '2' });
			await setUserActiveStatus.execute({ ...input, active: false });
			expect(usersRepositoryMock.unsetReasonById).toBeCalledWith(input.userId);
		});
		it('should NOT call the email template function nor the send mail function when the user does not have emails', async () => {
			usersRepositoryMock.findOneById.mockReturnValueOnce({ _id: '2' });
			await setUserActiveStatus.execute({ ...input, active: false });
			expect(emailTemplateServiceMock.html).not.toBeCalled();
			expect(emailTemplateServiceMock.subject).not.toBeCalled();
			expect(emailServiceMock.sendNoWrap).not.toBeCalled();
		});
		it('should NOT call the email template function nor the send mail function when is setting status to ACTIVE and the setting to send notify the user is false', async () => {
			usersRepositoryMock.findOneById.mockReturnValueOnce({ _id: '2', emails: [{ address: 'email1' }] });
			settingsServiceMock.getValue.mockReturnValueOnce(false);
			await setUserActiveStatus.execute(input);
			expect(emailTemplateServiceMock.html).not.toBeCalled();
			expect(emailTemplateServiceMock.subject).not.toBeCalled();
			expect(emailServiceMock.sendNoWrap).not.toBeCalled();
		});
		it('should NOT call the email template function nor the send mail function when is setting status to INACTIVE and the setting to send notify the user is false', async () => {
			usersRepositoryMock.findOneById.mockReturnValueOnce({ _id: '2', emails: [{ address: 'email1' }] });
			settingsServiceMock.getValue.mockReturnValueOnce(false);
			await setUserActiveStatus.execute({ ...input, active: false });
			expect(emailTemplateServiceMock.html).not.toBeCalled();
			expect(emailTemplateServiceMock.subject).not.toBeCalled();
			expect(emailServiceMock.sendNoWrap).not.toBeCalled();
		});
		it('should call the email template function and the send mail function when is setting status to ACTIVE and the setting to send notify the user is true', async () => {
			const user = { _id: '2', username: 'username', emails: [{ address: 'email1' }] };
			usersRepositoryMock.findOneById.mockReturnValueOnce(user);
			emailTemplateServiceMock.subject.mockReturnValueOnce('subject');
			emailTemplateServiceMock.html.mockReturnValueOnce('html');
			settingsServiceMock.getValue.mockReturnValue(true);
			await setUserActiveStatus.execute(input);
			expect(emailTemplateServiceMock.html).toBeCalledWith({ ...user, active: input.active });
			expect(emailTemplateServiceMock.subject).toBeCalledWith({ ...user, active: input.active });
			expect(emailServiceMock.sendNoWrap).toBeCalledWith({
				to: ['username<email1>'],
				from: true,
				subject: 'subject',
				html: 'html',
			});
		});
		it('should call the email template function and the send mail function when is setting status to INACTIVE and the setting to send notify the user is true', async () => {
			const user = { _id: '2', username: 'username', emails: [{ address: 'email1' }] };
			usersRepositoryMock.findOneById.mockReturnValueOnce(user);
			emailTemplateServiceMock.subject.mockReturnValueOnce('subject');
			emailTemplateServiceMock.html.mockReturnValueOnce('html');
			settingsServiceMock.getValue.mockReturnValue(true);
			await setUserActiveStatus.execute({ ...input, active: false });
			expect(emailTemplateServiceMock.html).toBeCalledWith({ ...user, active: false });
			expect(emailTemplateServiceMock.subject).toBeCalledWith({ ...user, active: false });
			expect(emailServiceMock.sendNoWrap).toBeCalledWith({
				to: ['username<email1>'],
				from: true,
				subject: 'subject',
				html: 'html',
			});
		});
	});
});
