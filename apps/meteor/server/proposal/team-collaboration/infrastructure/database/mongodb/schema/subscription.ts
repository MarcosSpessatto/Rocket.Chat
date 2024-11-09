import { DBEntity } from '@rocket.chat/fuel';

type RoomType = 'c' | 'd' | 'p' | 'l' | 'v';

export class SubscriptionModel extends DBEntity {
	public _id: string;

	u: any;

	// u: Pick<IUser, '_id' | 'username' | 'name'>;
	v?: any;

	// v?: Pick<IUser, '_id' | 'username' | 'name' | 'status'> & { token?: string };
	rid: string;

	open: boolean;

	ts: Date;

	name: string;

	alert?: boolean;

	unread: number;

	t: RoomType;

	ls: Date;

	f?: boolean;

	lr: Date;

	hideUnreadStatus?: true;

	hideMentionStatus?: true;

	teamMain?: boolean;

	teamId?: string;

	userMentions: number;

	groupMentions: number;

	broadcast?: true;

	tunread?: Array<string>;

	tunreadGroup?: Array<string>;

	tunreadUser?: Array<string>;

	prid?: string;

	roles?: string[];
	// roles?: IRole['_id'][];

	onHold?: boolean;

	encrypted?: boolean;

	E2EKey?: string;

	E2ESuggestedKey?: string;

	unreadAlert?: 'default' | 'all' | 'mentions' | 'nothing';

	fname?: string;

	code?: unknown;

	archived?: boolean;

	audioNotificationValue?: string;

	desktopNotifications?: 'all' | 'mentions' | 'nothing';

	mobilePushNotifications?: 'all' | 'mentions' | 'nothing';

	emailNotifications?: 'all' | 'mentions' | 'nothing';

	userHighlights?: string[];

	blocked?: unknown;

	blocker?: unknown;

	autoTranslate?: boolean;

	autoTranslateLanguage?: string;

	disableNotifications?: boolean;

	muteGroupMentions?: boolean;

	ignored?: string[];
	// ignored?: IUser['_id'][];

	department?: unknown;

	desktopPrefOrigin?: 'subscription' | 'user';

	mobilePrefOrigin?: 'subscription' | 'user';

	emailPrefOrigin?: 'subscription' | 'user';

	/* @deprecated */
	customFields?: Record<string, any>;

	public static getStorageName(): string {
		return 'rocketchat_subscription';
	}
}
