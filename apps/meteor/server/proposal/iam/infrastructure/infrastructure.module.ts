import type { Provider } from '@rocket.chat/fuel';
import { injectable, INJECTION_SCOPE, Module } from '@rocket.chat/fuel';

import { UserRepository } from './database/user';
import { IAMModuleProvider } from './external-module-integration/provider';

@injectable()
export class IAMInfrastructureModule extends Module {
	public async onStopModule(): Promise<void> {
		// noop
	}

	public static providers(): Provider[] {
		return [
			{ scope: INJECTION_SCOPE.TRANSIENT, constructor: IAMModuleProvider, token: 'IAMModuleProvider' },
			{ scope: INJECTION_SCOPE.TRANSIENT, constructor: UserRepository, token: 'UserRepository' },
		];
	}
}
