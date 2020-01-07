import { WebsocketMethods } from '../application/methods';
import { API } from '../application/api';

export * from './factories';

export const initApplication = (): void => {
	new API().run();
	new WebsocketMethods().run();
};
