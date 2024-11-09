import type { ModuleConstructor, Provider } from '@rocket.chat/fuel';
import { injectable, INJECTION_SCOPE, Module } from '@rocket.chat/fuel';

import { TeamCollaborationModuleProvider } from './infrastructure/external-module-integration/provider';
import { TeamCollaborationInfrastructureModule } from './infrastructure/infrastructure.module';
import { TeamCollaborationServicesModule } from './services/services.module';

@injectable()
export class TeamCollaborationModule extends Module {
	public async onStopModule(): Promise<void> {
		// noop
	}

	public static modules(): ModuleConstructor[] {
		return [TeamCollaborationInfrastructureModule, TeamCollaborationServicesModule];
	}

	public static providers(): Provider[] {
		return [{ scope: INJECTION_SCOPE.TRANSIENT, constructor: TeamCollaborationModuleProvider, token: 'TeamCollaborationModuleProvider' }];
	}
}
