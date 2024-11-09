import type { ModuleConstructor, Provider } from '@rocket.chat/fuel';
import { injectable, Module } from '@rocket.chat/fuel';

import { IAMInfrastructureModule } from './infrastructure/infrastructure.module';

@injectable()
export class IAMModule extends Module {
	public async onStopModule(): Promise<void> {
		// noop
	}

	public static modules(): ModuleConstructor[] {
		return [IAMInfrastructureModule];
	}

	public static providers(): Provider[] {
		return [];
	}
}
