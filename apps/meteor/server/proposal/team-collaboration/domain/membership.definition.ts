import type { Member } from './collaborators';
import type { RoomType } from './room.definition';

export interface IMembershipDomain {
	_id: string;
	member: Member;
	roomId: string;
	isOpen: boolean;
	createdAt: Date;
	name: string;
	mustAlert?: boolean;
	unreadMessagesCounter: number;
	userMentionsCounter: number;
	groupMentionsCounter: number;
	type: RoomType;
	lastSeenAt?: Date;
	lastReadAt?: Date; // TODO: Check with domain expert what is this? assuming it, db name: lr

	isTeamMainRoom?: boolean;
	teamId?: string;
	mustHideUnreadStatus?: boolean;
	mustHideMentionStatus?: boolean;
	isBroadcast?: true;
	parentRoomId?: string;
	roles?: string[]; // TODO: proper type this
	displayName?: string;
	isArchived?: boolean;
	audioNotificationValue?: string;
	desktopNotifications?: 'all' | 'mentions' | 'nothing';
	mobilePushNotifications?: 'all' | 'mentions' | 'nothing';
	emailNotifications?: 'all' | 'mentions' | 'nothing';
	userHighlightedWords?: string[];
	mustAutoTranslate?: boolean;
	autoTranslateLanguage?: string;
	mustDisableNotifications?: boolean;
	mustMuteGroupMentions?: boolean;
	ignoredMemberIds?: string[];
	desktopPreferencesOrigin?: 'subscription' | 'user';
	mobilePreferencesOrigin?: 'subscription' | 'user';
	emailPreferencesOrigin?: 'subscription' | 'user';
	customFields?: Record<string, any>;
}
