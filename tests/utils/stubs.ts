class BaseRepositoryMock {
	findOne: jest.Mock = jest.fn();

	findOneById: jest.Mock = jest.fn();

	find: jest.Mock = jest.fn();

	update: jest.Mock = jest.fn();

	updateOneById: jest.Mock = jest.fn();

	insert: jest.Mock = jest.fn();
}

export const usersRepositoryMock = new class UsersRepositoryMock extends BaseRepositoryMock {
	setUserActiveById: jest.Mock = jest.fn();

	findOneByIdOrUsername: jest.Mock = jest.fn();

	unsetLoginTokensById: jest.Mock = jest.fn();

	unsetReasonById: jest.Mock = jest.fn();
}();

export const subscriptionsRepositoryMock = new class SubscriptionRepositoryMock extends BaseRepositoryMock {
	setArchivedByUsername: jest.Mock = jest.fn();
}();

export const permissionsRepository = new class PermissionsRepositoryMock extends BaseRepositoryMock {

}();

export const authorizationServiceMock = new class AuthorizationServiceMock {
	hasPermission: jest.Mock = jest.fn();
}();

export const settingsServiceMock = new class SettingsServiceMock {
	getValue: jest.Mock = jest.fn();
}();

export const emailTemplateServiceMock = new class EmailTemplateServiceMock {
	html: jest.Mock = jest.fn();

	subject: jest.Mock = jest.fn();
}();

export const emailServiceMock = new class EmailTemplateServiceMock {
	sendNoWrap: jest.Mock = jest.fn();

	replace: jest.Mock = jest.fn();
}();
