import { check } from 'meteor/check';

import { getUserPresence, setUserActiveStatus } from '../../../configuration';
import { IRouter } from '../helpers/router';
import { success } from '../helpers/response';

export const userRoutes = (router: IRouter): void => {
	router.get('users.getPresence', { authRequired: true }, function() {
		if (this.isUserFromParams()) {
			return success(Promise.await(getUserPresence.execute(this.userId)));
		}
		const { userId, username, user } = this.requestParams();
		const userPresence = Promise.await(getUserPresence.execute(userId || username || user));
		return success({
			presence: userPresence.presence,
		});
	});

	router.post('users.setActiveStatus', { authRequired: true }, function() {
		check(this.bodyParams, {
			userId: String,
			activeStatus: Boolean,
		});
		Promise.await(setUserActiveStatus.execute({
			userId: this.bodyParams.userId,
			active: this.bodyParams.activeStatus,
			userIdWhoExecuteTheAction: this.userId,
		}));
		return success({ user: { _id: this.bodyParams.userId, activeStatus: this.bodyParams.activeStatus } });
	});
};
