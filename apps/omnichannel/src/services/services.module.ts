import type { Provider } from '@rocket.chat/fuel';
import { injectable, INJECTION_SCOPE, Module } from '@rocket.chat/fuel';

import { OmnichannelRoomService } from './room';

@injectable()
export class ServicesModule extends Module {
	public async onStopModule(): Promise<void> {
		// noop
	}

	public static providers(): Provider[] {
		return [{ scope: INJECTION_SCOPE.TRANSIENT, constructor: OmnichannelRoomService, token: 'OmnichannelRoomService' }];
	}
}
