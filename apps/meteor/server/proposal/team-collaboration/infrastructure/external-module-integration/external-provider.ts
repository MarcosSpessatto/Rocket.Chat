import { FUEL_DI_TOKENS, inject, injectable } from '@rocket.chat/fuel';
import type { DomainEvent } from '@rocket.chat/fuel/dist/internals';
import {
	DomainEventPublisher,
	DomainEventUniversalSubscriber,
	IInternalEphemeralMessagingClient,
	IInternalRPCAdapter,
	RemoteExternalModuleProvider,
} from '@rocket.chat/fuel/dist/internals';

class TeamCollaborationUniversalEventSubscriber extends DomainEventUniversalSubscriber {
	constructor(private action: (event: DomainEvent<any>) => Promise<void>) {
		super();
	}

	public async handle(event: DomainEvent<any>): Promise<void> {
		void this.action(event);
	}
}

@injectable()
export class TeamCollaborationExternalModuleProvider extends RemoteExternalModuleProvider {
	constructor(
		@inject(FUEL_DI_TOKENS.INTERNAL_RPC_ADAPTER) protected rpcAdapter: IInternalRPCAdapter,
		@inject(FUEL_DI_TOKENS.INTERNAL_EPHEMERAL_MESSAGING_CLIENT) protected messagingClient: IInternalEphemeralMessagingClient,
		@inject(FUEL_DI_TOKENS.DOMAIN_EVENT_PUBLISHER) protected domainEventPublisher: DomainEventPublisher,
	) {
		super(rpcAdapter, messagingClient);
	}

	public async broadcastEvent(event: DomainEvent<any>): Promise<void> {
		void this.messagingClient.emit(event.name, event);
	}

	public async registerActions(): Promise<void> {
		this.domainEventPublisher.subscribeForAllEvents(new TeamCollaborationUniversalEventSubscriber(this.broadcastEvent.bind(this)));
	}

	public async deleteServices(): Promise<void> {
		// noop
	}
}
