import { injectable, MongoDBBaseRepository } from '@rocket.chat/fuel';
import type { DBIncludeFields, IDBBasicWriter } from '@rocket.chat/fuel/dist/internals';

import type { IRoomDomain } from '../../../domain/room.definition';
import type { RoomModel } from './schema/room';

export interface IRoomRepository extends IDBBasicWriter {
	findOneByName<T = IRoomDomain>(name: string, fields?: DBIncludeFields): Promise<T | undefined>;
	findOneByDisplayName<T = IRoomDomain>(displayName: string, fields?: DBIncludeFields): Promise<T | undefined>;
	insertOneWithExtraData<T = IRoomDomain>(item: T, extraData?: Record<string, any>): Promise<void>;
}

@injectable()
export class RoomRepository extends MongoDBBaseRepository<RoomModel> implements IRoomRepository {
	public async findOneByName<T>(name: string, projection?: DBIncludeFields): Promise<T | undefined> {
		const raw = await this.collection.findOne<RoomModel>({ name }, { projection: projection?.fields });
		if (!raw) {
			return;
		}
		return this.convertFromDB(raw);
	}

	public async findOneByDisplayName<T>(displayName: string, projection?: DBIncludeFields): Promise<T | undefined> {
		const raw = await this.collection.findOne<RoomModel>({ fname: displayName }, { projection: projection?.fields });
		if (!raw) {
			return;
		}
		return this.convertFromDB(raw);
	}

	public async insertOneWithExtraData<T>(item: T, extraData?: Record<string, any>): Promise<void> {
		// TODO: remove extraData as soon as everything is migrated
		await this.collection.insertOne({ ...(this.convertToDB(item as any) as any), ...extraData });
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
			joinCodeRequired: 'isJoinCodeRequired',
			encrypted: 'isEncrypted',
			reactWhenReadOnly: 'canReactWhenReadonly',
			sysMes: 'hiddenSystemMessages',
			u: 'owner',
			uids: 'memberIds',
			lastMessage: 'lastMessageSent',
			lm: 'lastMessageTimestamp',
			usersCount: 'membersCounter',
			prid: 'parentRoomId',
			teamMain: 'isTeamMainRoom',
			teamDefault: 'isTeamDefaultRoom',
			open: 'isOpen',
			autoTranslate: 'mustAutoTranslate',
			unread: 'unreadCounter',
			alert: 'mustAlert',
			hideUnreadStatus: 'mustHideUnreadStatus',
			hideMentionStatus: 'mustHideMentionStatus',
			muted: 'mutedMemberUsernames',
			unmuted: 'unmutedMemberUsernames',
			usernames: 'memberUsernames',
			ts: 'createdAt',
			_updatedAt: 'updatedAt',
			ro: 'isReadonly',
			favorite: 'isFavorited',
			archived: 'isArchived',
			createdOTR: 'wasCreatedOTRSession',
			federated: 'isFederated',
		};
	}
}
