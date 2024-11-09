import type { Provider } from '@rocket.chat/fuel';
import { injectable, INJECTION_SCOPE, Module } from '@rocket.chat/fuel';

import { RoomService } from './room/room';

@injectable()
export class TeamCollaborationServicesModule extends Module {
	public async onStopModule(): Promise<void> {
		// noop
	}

	public static providers(): Provider[] {
		return [{ scope: INJECTION_SCOPE.TRANSIENT, constructor: RoomService, token: 'RoomService' }];
	}
}
