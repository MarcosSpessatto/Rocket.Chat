import type { Provider } from '@rocket.chat/fuel';
import { FUEL_DI_TOKENS, IExternalHttpRouter, inject, injectable, INJECTION_SCOPE, Module } from '@rocket.chat/fuel';

import { OmnichannelModuleConsumer } from '../infrastructure/external-module-integration/consumer/omnichannel';
import { OmnichannelCommandsController } from './commands/omnichannel/rooms';
import { OmnichannelQueriesController } from './queries/omnichannel/rooms';

@injectable()
export class APIModule extends Module {
	constructor(@inject(FUEL_DI_TOKENS.EXTERNAL_HTTP_ROUTER) private httpRouter: IExternalHttpRouter) {
		super();
	}

	public async onStartModule(): Promise<void> {
		this.httpRouter.registerControllers([OmnichannelCommandsController, OmnichannelQueriesController]);
	}

	public async onStopModule(): Promise<void> {
		this.httpRouter.unregisterControllers([OmnichannelCommandsController, OmnichannelQueriesController]);
	}

	public static providers(): Provider[] {
		return [{ scope: INJECTION_SCOPE.TRANSIENT, constructor: OmnichannelModuleConsumer, token: 'OmnichannelModuleConsumer' }];
	}
}
