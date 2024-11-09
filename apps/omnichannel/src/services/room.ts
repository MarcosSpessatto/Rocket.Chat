import { FUEL_DI_TOKENS, IDBConnectionReaderFactory, inject, injectable } from '@rocket.chat/fuel';

import type { IOmnichannelRoomDomain } from '../domain/definition';
import type { CreateRoomInput } from '../domain/room';
import { createRoom } from '../domain/room';
import { IOmnichannelRoomRepository } from '../infrastructure/database/mongodb/room';

@injectable()
export class OmnichannelRoomService {
	constructor(
		@inject(FUEL_DI_TOKENS.DB_CONNECTION_READER_FACTORY) protected dbReaderFactory: IDBConnectionReaderFactory,
		@inject('OmnichannelRoomRepository') protected roomRepository: IOmnichannelRoomRepository,
	) {}

	public async createRoom(input: CreateRoomInput): Promise<void> {
		const newRoom = createRoom(input);

		await this.roomRepository.insertOne(newRoom);
	}

	public async deleteRoom(id: string): Promise<void> {
		const room = await this.roomRepository.findOneById<Pick<IOmnichannelRoomDomain, '_id'>>(id, { fields: { _id: true } });
		if (!room) {
			throw new Error('Room not found');
		}

		await this.roomRepository.deleteOneById(id);
	}
}
