import { injectable, MongoDBBaseRepository } from '@rocket.chat/fuel';
import type { DBReadItemsParams, IDBBasicWriter } from '@rocket.chat/fuel/dist/internals';

import type { IOmnichannelRoomDomain } from '../../../domain/definition';
import type { OmnichannelRoomModel } from './schema/room';

export interface IOmnichannelRoomRepository extends IDBBasicWriter {
	insertOne<T = IOmnichannelRoomDomain>(item: T): Promise<void>;
}

@injectable()
export class OmnichannelRoomRepository extends MongoDBBaseRepository<OmnichannelRoomModel> implements IOmnichannelRoomRepository {
	public async insertOne<T = IOmnichannelRoomDomain>(item: T): Promise<void> {
		await this.collection.insertOne(this.convertToDB(item as any) as any); // TODO: fix types
	}

	public async findAll<TReturn>(options?: DBReadItemsParams): Promise<TReturn[]> {
		return (await this.collection.find({ t: 'l' }, options)).map((item) => this.convertFromDB(item as any)) as unknown as TReturn[]; // TODO: fix types
	}

	public static collectionName(): string {
		return 'rocketchat_room';
	}

	public fieldsMapping(): Record<string, string> {
		return {
			t: 'type',
			fname: 'displayName',
			msgs: 'msgsCounter',
			default: 'isDefault',
			broadcast: 'isBroadcast',
			featured: 'isFeatured',
			u: 'owner',
			uids: 'membersIds',
			ts: 'createdAt',
			usersCount: 'membersCounter',
		};
	}
}
