import { Random } from '@rocket.chat/random';

import type { Member } from './collaborators';
import type { IMembershipDomain } from './membership.definition';
import type { IRoomDomain } from './room.definition';

export const createDefaultNotificationPreferences = (memberPreferences?: {
	desktopNotifications: any;
	pushNotifications: any;
	emailNotificationMode: any;
	highlights: string[];
}) => {
	// TODO: improve this type
	const preferences: Pick<
		IMembershipDomain,
		| 'userHighlightedWords'
		| 'desktopNotifications'
		| 'desktopPreferencesOrigin'
		| 'mobilePushNotifications'
		| 'mobilePreferencesOrigin'
		| 'emailNotifications'
		| 'emailPreferencesOrigin'
	> = {};

	const { desktopNotifications, pushNotifications, emailNotificationMode, highlights } = memberPreferences || {};

	if (Array.isArray(highlights) && highlights.length) {
		preferences.userHighlightedWords = highlights;
	}

	if (desktopNotifications && desktopNotifications !== 'default') {
		preferences.desktopNotifications = desktopNotifications;
		preferences.desktopPreferencesOrigin = 'user';
	}

	if (pushNotifications && pushNotifications !== 'default') {
		preferences.mobilePushNotifications = pushNotifications;
		preferences.mobilePreferencesOrigin = 'user';
	}

	if (emailNotificationMode && emailNotificationMode !== 'default') {
		preferences.emailNotifications = emailNotificationMode;
		preferences.emailPreferencesOrigin = 'user';
	}

	return preferences;
};

export function createAutotranslateDefaultConfig({
	userLanguage,
	workspaceSettings,
}: {
	userLanguage?: string;
	workspaceSettings: { autoTranslateWhenJoiningRoom: boolean; language: string };
}):
	| {
			autoTranslate: boolean;
			autoTranslateLanguage: string;
	  }
	| undefined {
	if (!workspaceSettings.autoTranslateWhenJoiningRoom) {
		return;
	}

	if (!userLanguage || userLanguage === 'default' || workspaceSettings.language === userLanguage) {
		return;
	}

	return { autoTranslate: true, autoTranslateLanguage: userLanguage };
}

export const createRoomMembership = ({ room, member }: { room: IRoomDomain; member: Member }): IMembershipDomain => ({
	_id: Random.id(),
	isOpen: true,
	mustAlert: false,
	unreadMessagesCounter: 0,
	userMentionsCounter: 0,
	groupMentionsCounter: 0,
	createdAt: room.createdAt || new Date(),
	member: {
		_id: member._id,
		username: member.username,
		name: member.name,
	},
	roomId: room._id,
	name: room.name,
	displayName: room.displayName,
	type: room.type,
	...(room.owner.username === member.username ? { lastSeenAt: new Date(), roles: ['owner'] } : {}),
	...(room.customFields && { customFields: room.customFields }),
	...(createAutotranslateDefaultConfig({
		userLanguage: member.settings?.preferences?.userLanguage,
		workspaceSettings: { autoTranslateWhenJoiningRoom: false, language: 'pt' },
	}) || {}),
	...(createDefaultNotificationPreferences(member.settings?.preferences as any) || {}), // TODO: fix this type
});
