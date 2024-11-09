import { FUEL_DI_TOKENS, inject, injectable } from '@rocket.chat/fuel';
import type { IInternalRPCServiceRegistrar } from '@rocket.chat/fuel/dist/internals';
import { IInternalEphemeralMessagingClient, IInternalRPCAdapter, RemoteExternalModuleProvider } from '@rocket.chat/fuel/dist/internals';

import type { CreateRoomInput } from '../../domain/room';
import { OmnichannelRoomService } from '../../services/room';
import { OmnichannelRoomRepository } from '../database/mongodb/room';

type OmnichannelRoomsDTO = {
	_id: string;
	membersCounter: number;
	msgsCounter: number;
	type: 'l';
	name: string;
	owner: any;
	displayName: string;
	membersIds: string[];
	createdAt: string;
};

@injectable()
export class OmnichannelModuleProvider extends RemoteExternalModuleProvider {
	private omnichannelServiceRegistrar: IInternalRPCServiceRegistrar | null;

	constructor(
		@inject(FUEL_DI_TOKENS.INTERNAL_RPC_ADAPTER) protected rpcAdapter: IInternalRPCAdapter,
		@inject(FUEL_DI_TOKENS.INTERNAL_EPHEMERAL_MESSAGING_CLIENT) protected messagingClient: IInternalEphemeralMessagingClient,
		@inject('OmnichannelRoomService') protected roomService: OmnichannelRoomService,
		@inject('OmnichannelRoomRepository') protected roomRepo: OmnichannelRoomRepository,
	) {
		super(rpcAdapter, messagingClient);
	}

	public async registerActions(): Promise<void> {
		this.omnichannelServiceRegistrar = await this.rpcAdapter.createRPCService('omnichannel');

		await this.omnichannelServiceRegistrar.registerAction<CreateRoomInput, void>(
			'create-omnichannel-room',
			async (input: CreateRoomInput) => this.roomService.createRoom(input),
		);
		await this.omnichannelServiceRegistrar.registerAction<string, void>('delete-omnichannel-room', async (id: string) =>
			this.roomService.deleteRoom(id),
		);
		await this.omnichannelServiceRegistrar.registerAction<void, OmnichannelRoomsDTO[]>('get-all-omnichannel-rooms', async () =>
			this.roomRepo.findAll<OmnichannelRoomsDTO>(),
		);
	}

	public getOmnichannelRPCServiceInstance(): IInternalRPCServiceRegistrar {
		if (!this.omnichannelServiceRegistrar) {
			throw new Error('Omnichannel Service is not registered yet');
		}
		return this.omnichannelServiceRegistrar;
	}

	public async deleteServices(): Promise<void> {
		await this.rpcAdapter.deleteRPCService('omnichannel');
	}
}
