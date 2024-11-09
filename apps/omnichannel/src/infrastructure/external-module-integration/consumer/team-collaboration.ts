import { inject, injectable } from '@rocket.chat/fuel';
import type { CancellableEvent, DomainEvent, PublishableEvent } from '@rocket.chat/fuel/dist/internals';
import {
	FUEL_DI_TOKENS,
	IInternalEphemeralMessagingRegistrar,
	IInternalRPCClient,
	RemoteExternalModuleConsumer,
} from '@rocket.chat/fuel/dist/internals';

import { OmnichannelModuleProvider } from '../provider';

@injectable()
export class TeamCollaborationExternalModuleConsumer extends RemoteExternalModuleConsumer {
	private registeredEvents: CancellableEvent[] = [];

	constructor(
		@inject(FUEL_DI_TOKENS.INTERNAL_RPC_CLIENT) protected rpcClient: IInternalRPCClient,
		@inject(FUEL_DI_TOKENS.INTERNAL_EPHEMERAL_MESSAGING_REGISTRAR)
		protected messagingRegistrar: IInternalEphemeralMessagingRegistrar,
		@inject('OmnichannelModuleProvider') protected omnichannelModuleProvider: OmnichannelModuleProvider,
	) {
		super(rpcClient, messagingRegistrar);
	}

	public async registerEvents(): Promise<void> {
		this.registeredEvents.push(
			await this.messagingRegistrar.registerConsumer(
				'team-collaboration.public-room-created',
				async (event: PublishableEvent<DomainEvent<any>>) => {
					// any handling logic
					console.log({ event });
				},
				this.omnichannelModuleProvider.getOmnichannelRPCServiceInstance(),
			),
		);
	}

	public async stopEventListeners(): Promise<void> {
		await Promise.all(this.registeredEvents.map((listener) => listener.cancel()));
	}
}
