import { injectable, MongoDBBaseRepository } from '@rocket.chat/fuel';
import type { IDBBasicWriter } from '@rocket.chat/fuel/dist/internals';

import type { IMembershipDomain } from '../../../domain/membership.definition';

export interface ISubscriptionRepository extends IDBBasicWriter {
	insertManyWithExtraData<T = IMembershipDomain>(memberships: T[], extraData?: Record<string, any>): Promise<void>;
}

@injectable()
export class SubscriptionRepository extends MongoDBBaseRepository<any> implements ISubscriptionRepository {
	public async insertManyWithExtraData<T>(memberships: T[], extraData?: Record<string, any>): Promise<void> {
		// TODO: remove extraData as soon as everything is migrated
		await this.collection.insertMany(memberships.map((membership) => ({ ...this.convertToDB(membership as any), ...extraData })));
	}

	public static collectionName(): string {
		return 'rocketchat_subscription';
	}

	public fieldsMapping(): Record<string, string> {
		return {
			t: 'type',
			fname: 'displayName',
			encrypted: 'isEncrypted',
			u: 'member',
			rid: 'roomId',
			prid: 'parentRoomId',
			ls: 'lastSeenAt',
			lr: 'lastReadAt',
			teamMain: 'isTeamMainRoom',
			broadcast: 'isBroadcast',
			open: 'isOpen',
			autoTranslate: 'mustAutoTranslate',
			unread: 'unreadMessagesCounter',
			alert: 'mustAlert',
			hideUnreadStatus: 'mustHideUnreadStatus',
			hideMentionStatus: 'mustHideMentionStatus',
			ts: 'createdAt',
			_updatedAt: 'updatedAt',
			archived: 'isArchived',
			userHighlights: 'userHighlightedWords',
			disableNotifications: 'mustDisableNotifications',
			muteGroupMentions: 'mustMuteGroupMentions',
			ignored: 'ignoredMemberIds',
			desktopPrefOrigin: 'desktopPreferencesOrigin',
			mobilePrefOrigin: 'mobilePreferencesOrigin',
			emailPrefOrigin: 'emailPreferencesOrigin',
			userMentions: 'userMentionsCounter',
			groupMentions: 'groupMentionsCounter',
		};
	}
}
