import { inject, injectable, InMemoryExternalModuleConsumer } from '@rocket.chat/fuel';

import { TeamCollaborationModuleProvider } from '../../proposal/team-collaboration/infrastructure/external-module-integration/provider';
import type { CreateRoomParams, SettingsFromCore } from '../../proposal/team-collaboration/shared/input/room-input';

@injectable()
export class MonolithTeamCollaborationModuleConsumer extends InMemoryExternalModuleConsumer {
	constructor(@inject('TeamCollaborationModuleProvider') private teamCollabModuleProvider: TeamCollaborationModuleProvider) {
		super(teamCollabModuleProvider);
	}

	public async createRoomAndMembership(
		input: CreateRoomParams & { settings: SettingsFromCore },
		roomExtraData?: Record<string, any>,
		subscriptionExtraData?: Record<string, any>,
	): Promise<string> {
		// TODO: this extraData needs to be removed as soon as we have everything migrated
		return this.teamCollabModuleProvider.createRoomAndMembership(input, roomExtraData, subscriptionExtraData);
	}
}
