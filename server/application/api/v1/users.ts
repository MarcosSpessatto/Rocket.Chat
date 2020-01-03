import { getUserStatusUseCase } from '../../../configuration';
import { IRouter } from '../helpers/router';
import { success } from '../helpers/response';

export const userRoutes = (router: IRouter): void => {
	router.get('users.getPresence', { authRequired: true }, function() {
		if (this.isUserFromParams()) {
			return success(Promise.await(getUserStatusUseCase.execute(this.userId)));
		}
		const { userId, username, user } = this.requestParams();
		const ar = Promise.await(getUserStatusUseCase.execute(userId || username || user));
		return success({
			presence: ar.presence,
		});
	});
};
