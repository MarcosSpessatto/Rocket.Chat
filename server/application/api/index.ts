import { router } from './helpers/router.helper';
import { userRoutes } from './v1/users';

export class API {

	constructor() {
	}

	run(): void {
		userRoutes(router);
	}
}
