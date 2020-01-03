import { router } from './helpers/router';
import { userRoutes } from './v1/users';

export class API {
	run(): void {
		userRoutes(router);
	}
}
