import type { Provider } from '@rocket.chat/fuel';
import { FUEL_DI_TOKENS, EnterpriseModule, IExternalHttpRouter, inject, INJECTION_SCOPE, injectable } from '@rocket.chat/fuel';
import { License } from '@rocket.chat/license';

import { MessageReader, MessagesQueriesController } from './api/queries/read-receipts';

@injectable()
export class TeamCollaborationEnterprise extends EnterpriseModule {
	constructor(@inject(FUEL_DI_TOKENS.EXTERNAL_HTTP_ROUTER) private httpRouter: IExternalHttpRouter) {
		super();
	}

	public static async enterpriseRequirements(): Promise<boolean> {
		return License.hasModule('message-read-receipt');
	}

	public async onStartModule(): Promise<void> {
		this.httpRouter.registerControllers([MessagesQueriesController]);
	}

	public async onStopModule(): Promise<void> {
		this.httpRouter.unregisterControllers([MessagesQueriesController]);
	}

	public static providers(): Provider[] {
		return [{ scope: INJECTION_SCOPE.TRANSIENT, constructor: MessageReader, token: 'MessageReader' }];
	}
}
