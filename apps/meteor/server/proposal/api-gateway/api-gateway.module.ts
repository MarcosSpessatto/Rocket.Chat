import type { ModuleConstructor, Provider } from '@rocket.chat/fuel';
import { FUEL_DI_TOKENS, ILogger, injectable, Module, inject } from '@rocket.chat/fuel';

import { APIModule } from './api/api.module';

@injectable()
export class APIGatewayModule extends Module {
	constructor(@inject(FUEL_DI_TOKENS.LOGGER) private logger: ILogger) {
		super();
	}

	public async onStartModule(): Promise<void> {
		this.logger.info('API STARTED');
	}

	public async onStopModule(): Promise<void> {
		// noop
	}

	public static modules(): ModuleConstructor[] {
		return [APIModule];
	}

	public static providers(): Provider[] {
		return [];
	}
}
