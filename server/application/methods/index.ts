import { registerUserMethods } from './users';
import { websocketMethodRegistration } from './helpers/registerMethod';

export class WebsocketMethods {
	run(): void {
		registerUserMethods(websocketMethodRegistration);
	}
}
