import type { Provider } from '@rocket.chat/fuel';
import { inject, injectable, INJECTION_SCOPE, Module } from '@rocket.chat/fuel';

import { OmnichannelRoomRepository } from './database/mongodb/room';
import { TeamCollaborationExternalModuleConsumer } from './external-module-integration/consumer/team-collaboration';
import { OmnichannelModuleProvider } from './external-module-integration/provider';

@injectable()
export class InfrastructureModule extends Module {
	constructor(
		@inject('OmnichannelModuleProvider') private omnichannelModuleProvider: OmnichannelModuleProvider,
		@inject('TeamCollaborationExternalModuleConsumer') private teamCollabModuleConsumer: TeamCollaborationExternalModuleConsumer,
	) {
		super();
	}

	public async onStartModule(): Promise<void> {
		await this.omnichannelModuleProvider.registerActions();
		await this.teamCollabModuleConsumer.registerEvents();
	}

	public async onStopModule(): Promise<void> {
		await this.omnichannelModuleProvider.deleteServices();
		await this.teamCollabModuleConsumer.stopEventListeners();
	}

	public static providers(): Provider[] {
		return [
			{ scope: INJECTION_SCOPE.SINGLETON, constructor: OmnichannelModuleProvider, token: 'OmnichannelModuleProvider' },
			{ scope: INJECTION_SCOPE.SINGLETON, constructor: OmnichannelRoomRepository, token: 'OmnichannelRoomRepository' },
			{
				scope: INJECTION_SCOPE.SINGLETON,
				constructor: TeamCollaborationExternalModuleConsumer,
				token: 'TeamCollaborationExternalModuleConsumer',
			},
		];
	}
}
