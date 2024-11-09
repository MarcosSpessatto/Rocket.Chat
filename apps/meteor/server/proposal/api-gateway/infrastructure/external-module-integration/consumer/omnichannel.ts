import {
	FUEL_DI_TOKENS,
	IInternalEphemeralMessagingRegistrar,
	IInternalRPCClient,
	inject,
	injectable,
	RemoteExternalModuleConsumer,
} from '@rocket.chat/fuel';

export type CreateOmnichannelRoomInputPayload = {
	name: string;
	exampleIds: string[];
	example: string;
	when?: string;
};

export type OmnichannelRoomOutputDTO = {
	_id: string;
	type: 'l';
	name: string;
	displayName: string;
	msgsCounter: number;
	createdAt: string;
	membersCounter: number;
};

@injectable()
export class OmnichannelModuleConsumer extends RemoteExternalModuleConsumer {
	constructor(
		@inject(FUEL_DI_TOKENS.INTERNAL_RPC_CLIENT) protected rpcClient: IInternalRPCClient,
		@inject(FUEL_DI_TOKENS.INTERNAL_EPHEMERAL_MESSAGING_REGISTRAR)
		protected messagingRegistrar: IInternalEphemeralMessagingRegistrar,
	) {
		super(rpcClient, messagingRegistrar);
	}

	public async createOmnichannelRoom(input: CreateOmnichannelRoomInputPayload): Promise<void> {
		return this.rpcClient.send<CreateOmnichannelRoomInputPayload, void>('omnichannel', 'create-omnichannel-room', input);
	}

	public async deleteRoom(roomId: string): Promise<void> {
		return this.rpcClient.send<string, void>('omnichannel', 'delete-omnichannel-room', roomId);
	}

	public async getAllRooms(): Promise<OmnichannelRoomOutputDTO[]> {
		return this.rpcClient.send<void, OmnichannelRoomOutputDTO[]>('omnichannel', 'get-all-omnichannel-rooms', undefined);
	}

	public async stopEventListeners(): Promise<void> {
		// noop
	}
}
