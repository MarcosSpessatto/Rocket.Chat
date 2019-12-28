import { IRouter } from '../../helpers/router.helper';
import { getUserPresence } from './users'

export const userRoutes = (router: IRouter) => {
	router.get('users.getPresence', { authRequired: true }, getUserPresence);
}