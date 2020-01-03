import { Meteor } from 'meteor/meteor';

import { getUserStatusUseCase } from '../../../configuration/factories/users';
import { IWebsocketMethodRegistration } from '../helpers/registerMethod';

export const registerUserMethods = (websocketMethodRegistration: IWebsocketMethodRegistration): void => {
	websocketMethodRegistration.registerMethod('getUserPresence', () => Promise.await(getUserStatusUseCase.execute(Meteor.userId() as string)));
};
