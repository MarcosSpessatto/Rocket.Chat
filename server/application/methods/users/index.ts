import { Meteor } from 'meteor/meteor';

import { setUserActiveStatus } from '../../../configuration';
import { IWebsocketMethodRegistration } from '../helpers/registerMethod';

export const registerUserMethods = (websocketMethodRegistration: IWebsocketMethodRegistration): void => {
	websocketMethodRegistration.registerMethod('setUserActiveStatus', (userId: string, active: boolean): void => {
		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {
				method: 'setUserActiveStatus',
			});
		}
		Promise.await(setUserActiveStatus.execute({
			userId,
			active,
			userIdWhoExecuteTheAction: Meteor.userId() as string,
		}));
	});
};
