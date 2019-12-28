import { API } from '../../../../app/api';

interface APIV1Options {
	authRequired: boolean;
	permissionRequired?: string[];
	rateLimiterOptions?: {
		numRequestsAllowed: number,
		intervalTimeInMS: number
	}
};

export interface IRouter {
	post(route: string, middleware: APIV1Options | Function, handler: Function): Function;
	get(route: string, middleware: APIV1Options | Function, handler: Function): Function;
	put(route: string, middleware: APIV1Options | Function, handler: Function): Function;
	delete(route: string, middleware: APIV1Options | Function, handler: Function): Function;
}

export const router = {
	post: (route: string, middleware: APIV1Options | Function, handler: Function) => (API as any).v1.addRoute(route, middleware, { post: handler }),
	get: (route: string, middleware: APIV1Options | Function, handler: Function) => (API as any).v1.addRoute(route, middleware, { get: handler }),
	put: (route: string, middleware: APIV1Options | Function, handler: Function) => (API as any).v1.addRoute(route, middleware, { put: handler }),
	delete: (route: string, middleware: APIV1Options | Function, handler: Function) => (API as any).v1.addRoute(route, middleware, { delete: handler }),
};
