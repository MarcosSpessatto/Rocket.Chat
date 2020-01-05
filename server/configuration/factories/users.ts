import {
	MongoDbUsersRepository,
	MongoDbSubscriptionsRepository,
	MongoDbPermissionsRepository,
	MemoizationService,
	AuthorizationService,
	SettingsService,
	UserActivatedEmailTemplateService,
	TapI18nTranslatorService,
	MeteorEmailService,
	UnderscoreStringHelper,
} from '../../infrastructure';
import { GetUserPresence, SetUserActiveStatus } from '../../core';
import { Users, Subscriptions, Permissions } from '../../../app/models/server';


const usersRepository = new MongoDbUsersRepository(Users.model.rawCollection());
const subscriptionsRepository = new MongoDbSubscriptionsRepository(Subscriptions.model.rawCollection());
const permissionsRepository = new MongoDbPermissionsRepository(Permissions.model.rawCollection());

const memoizationService = new MemoizationService();
const settingsService = new SettingsService();
const tapI18NTranslatorService = new TapI18nTranslatorService();
const meteorEmailService = new MeteorEmailService();
const underscoreStringHelper = new UnderscoreStringHelper();
const authorizationService = new AuthorizationService(memoizationService, permissionsRepository, usersRepository, subscriptionsRepository);
const userActivatedEmailTemplateService = new UserActivatedEmailTemplateService(settingsService, tapI18NTranslatorService, meteorEmailService, underscoreStringHelper);

export const getUserPresence = new GetUserPresence(usersRepository);
export const setUserActiveStatus = new SetUserActiveStatus(usersRepository, subscriptionsRepository, authorizationService, settingsService, userActivatedEmailTemplateService, meteorEmailService);
