import type { Provider } from '@rocket.chat/fuel';
import { inject, injectable, INJECTION_SCOPE, Module } from '@rocket.chat/fuel';

import { RoomService } from '../services/room/room';
import { RoomRepository } from './database/mongodb/room';
import { SubscriptionRepository } from './database/mongodb/subscription';
import { IAMModuleConsumer, IAMReader } from './external-module-integration/consumer/iam';
import { TeamCollaborationExternalModuleProvider } from './external-module-integration/external-provider';
import { TeamCollaborationModuleProvider } from './external-module-integration/provider';

@injectable()
export class TeamCollaborationInfrastructureModule extends Module {
	constructor(
		@inject('TeamCollaborationExternalModuleProvider') private teamCollabExternalModuleProvider: TeamCollaborationExternalModuleProvider,
	) {
		super();
	}

	public async onStopModule(): Promise<void> {
		// noop
	}

	public async onStartModule(): Promise<void> {
		await this.teamCollabExternalModuleProvider.registerActions();
	}

	public static providers(): Provider[] {
		return [
			{ scope: INJECTION_SCOPE.TRANSIENT, constructor: TeamCollaborationModuleProvider, token: 'TeamCollaboration' },
			{ scope: INJECTION_SCOPE.TRANSIENT, constructor: RoomService, token: 'RoomService' },
			{ scope: INJECTION_SCOPE.TRANSIENT, constructor: RoomRepository, token: 'RoomRepository' },
			{ scope: INJECTION_SCOPE.TRANSIENT, constructor: SubscriptionRepository, token: 'SubscriptionRepository' },
			{ scope: INJECTION_SCOPE.TRANSIENT, constructor: IAMModuleConsumer, token: 'IAMModuleConsumer' },
			{
				scope: INJECTION_SCOPE.TRANSIENT,
				constructor: TeamCollaborationExternalModuleProvider,
				token: 'TeamCollaborationExternalModuleProvider',
			},
			{ scope: INJECTION_SCOPE.TRANSIENT, constructor: IAMReader, token: 'IAMReader' },
		];
	}
}
