import { UserLanguageBuilder, UserPreferencesBuilder } from '../../../../tests/proposal/utils/iam/user-builder';
import { WorkspaceSettingsBuilder } from '../../../../tests/proposal/utils/settings/settings-builder';
import { CollaboratorBuilder } from '../../../../tests/proposal/utils/team-collaboration/collaborator-builder';
import { RoomBuilder } from '../../../../tests/proposal/utils/team-collaboration/room-builder';
import { createAutotranslateDefaultConfig, createDefaultNotificationPreferences, createRoomMembership } from './membership';

const date = new Date();

jest.useFakeTimers().setSystemTime(date);

jest.mock('@rocket.chat/random', () => ({
	Random: {
		id: jest.fn().mockReturnValue('generated-id'),
	},
}));

describe('Team Collaboration - Domain', () => {
	afterEach(() => jest.restoreAllMocks());

	describe('Membership', () => {
		describe('#createDefaultNotificationPreferences()', () => {
			it('should return an empty membership notification preference when the user has no preference set', () => {
				expect(createDefaultNotificationPreferences({} as any)).toEqual({});
			});

			it('should return a membership notification only with highlights if only highlights were defined', () => {
				const memberPref = UserPreferencesBuilder.aSettingPreference().build();
				delete memberPref.desktopNotifications;
				delete memberPref.emailNotificationMode;
				delete memberPref.pushNotifications;

				expect(createDefaultNotificationPreferences(memberPref as any)).toEqual({ userHighlightedWords: memberPref.highlights });
			});

			it('should return a membership notification with highlights and desktop notifications if desktop notifications are not equals default', () => {
				const memberPref = UserPreferencesBuilder.aSettingPreference().withDesktopNotifications('all').build();
				delete memberPref.emailNotificationMode;
				delete memberPref.pushNotifications;

				expect(createDefaultNotificationPreferences(memberPref as any)).toEqual({
					userHighlightedWords: memberPref.highlights,
					desktopNotifications: memberPref.desktopNotifications,
					desktopPreferencesOrigin: 'user',
				});
			});

			it('should return a membership notification with highlights and NOT desktop notifications if desktop notifications are equals default', () => {
				const memberPref = UserPreferencesBuilder.aSettingPreference().withDesktopNotifications('default').build();
				delete memberPref.emailNotificationMode;
				delete memberPref.pushNotifications;

				expect(createDefaultNotificationPreferences(memberPref as any)).toEqual({
					userHighlightedWords: memberPref.highlights,
				});
			});

			it('should return a membership notification with highlights, desktop notifications and push notifications if push notifications are not equals default', () => {
				const memberPref = UserPreferencesBuilder.aSettingPreference().withDesktopNotifications('all').withPushNotifications('all').build();
				delete memberPref.emailNotificationMode;

				expect(createDefaultNotificationPreferences(memberPref as any)).toEqual({
					userHighlightedWords: memberPref.highlights,
					desktopNotifications: memberPref.desktopNotifications,
					desktopPreferencesOrigin: 'user',
					mobilePushNotifications: memberPref.pushNotifications,
					mobilePreferencesOrigin: 'user',
				});
			});

			it('should return a membership notification with highlights, and NOT push notifications if push notifications are equals default', () => {
				const memberPref = UserPreferencesBuilder.aSettingPreference()
					.withDesktopNotifications('default')
					.withPushNotifications('default')
					.build();

				expect(createDefaultNotificationPreferences(memberPref as any)).toEqual({
					userHighlightedWords: memberPref.highlights,
				});
			});

			it('should return a membership notification with highlights, desktop notifications, push notifications  and email notifications if email notifications are not equals default', () => {
				const memberPref = UserPreferencesBuilder.aSettingPreference()
					.withDesktopNotifications('all')
					.withPushNotifications('all')
					.withEmailNotifications('all')
					.build();

				expect(createDefaultNotificationPreferences(memberPref as any)).toEqual({
					userHighlightedWords: memberPref.highlights,
					desktopNotifications: memberPref.desktopNotifications,
					desktopPreferencesOrigin: 'user',
					mobilePushNotifications: memberPref.pushNotifications,
					mobilePreferencesOrigin: 'user',
					emailNotifications: memberPref.pushNotifications,
					emailPreferencesOrigin: 'user',
				});
			});

			it('should return a membership notification with highlights, and NOT email notifications if email notifications are equals default', () => {
				const memberPref = UserPreferencesBuilder.aSettingPreference()
					.withDesktopNotifications('default')
					.withPushNotifications('default')
					.withEmailNotifications('default')
					.build();

				expect(createDefaultNotificationPreferences(memberPref as any)).toEqual({
					userHighlightedWords: memberPref.highlights,
				});
			});
		});

		describe('#createAutotranslateDefaultConfig()', () => {
			it('should return undefined if the workspace config does not set to auto translate the rooms when joining', () => {
				const userLanguage = UserLanguageBuilder.aLanguagePreference().build();
				const workspaceSettings = WorkspaceSettingsBuilder.aSetting().build();

				expect(createAutotranslateDefaultConfig({ userLanguage: userLanguage.language, workspaceSettings })).toBeUndefined();
			});

			it('should return undefined if the workspace config sets auto translate when joining rooms but the user does not have a language defined', () => {
				const userLanguage = UserLanguageBuilder.aLanguagePreference().build();
				const workspaceSettings = WorkspaceSettingsBuilder.aSetting().withAutoTranslateWhenJoiningRoom(true).build();

				expect(createAutotranslateDefaultConfig({ userLanguage: userLanguage.language, workspaceSettings })).toBeUndefined();
			});

			it('should return undefined if the workspace config sets auto translate when joining rooms, but the user has a default language', () => {
				const userLanguage = UserLanguageBuilder.aLanguagePreference().withLanguage('default').build();
				const workspaceSettings = WorkspaceSettingsBuilder.aSetting().withAutoTranslateWhenJoiningRoom(true).build();

				expect(createAutotranslateDefaultConfig({ userLanguage: userLanguage.language, workspaceSettings })).toBeUndefined();
			});

			it("should return undefined if the workspace config sets auto translate when joining rooms, but the user's language is the same as the workspace", () => {
				const userLanguage = UserLanguageBuilder.aLanguagePreference().withLanguage('en-us').build();
				const workspaceSettings = WorkspaceSettingsBuilder.aSetting().withAutoTranslateWhenJoiningRoom(true).withLanguage('en-us').build();

				expect(createAutotranslateDefaultConfig({ userLanguage: userLanguage.language, workspaceSettings })).toBeUndefined();
			});

			it('should return the autoTranslate default config when the workspace sets to auto translate when joining rooms and the user language is different than the workspace (needs to be translated)', () => {
				const userLanguage = UserLanguageBuilder.aLanguagePreference().withLanguage('pt-br').build();
				const workspaceSettings = WorkspaceSettingsBuilder.aSetting().withAutoTranslateWhenJoiningRoom(true).withLanguage('en-us').build();

				expect(createAutotranslateDefaultConfig({ userLanguage: userLanguage.language, workspaceSettings })).toEqual({
					autoTranslate: true,
					autoTranslateLanguage: userLanguage.language,
				});
			});
		});

		describe('#createRoomMembership()', () => {
			it('should return the room membership without any optional property', () => {
				const room = RoomBuilder.aRoom().build();
				const member = CollaboratorBuilder.aCollaborator().build();

				expect(createRoomMembership({ room: room as any, member })).toEqual({
					_id: 'generated-id',
					createdAt: date,
					displayName: room.displayName,
					groupMentionsCounter: 0,
					isOpen: true,
					member,
					mustAlert: false,
					name: room.name,
					roomId: room._id,
					type: room.type,
					unreadMessagesCounter: 0,
					userMentionsCounter: 0,
				});
			});

			it('should return the room membership with the property lastSeenAt and roles [owner] when the membership is for the room owner', () => {
				const member = CollaboratorBuilder.aCollaborator().build();
				const room = RoomBuilder.aRoom().withOwner(member).build();

				expect(createRoomMembership({ room: room as any, member })).toEqual({
					_id: 'generated-id',
					createdAt: date,
					displayName: room.displayName,
					groupMentionsCounter: 0,
					isOpen: true,
					member,
					mustAlert: false,
					name: room.name,
					roomId: room._id,
					type: room.type,
					unreadMessagesCounter: 0,
					userMentionsCounter: 0,
					lastSeenAt: date,
					roles: ['owner'],
				});
			});

			it('should return the room membership with custom fields if the room has custom fields', () => {
				const member = CollaboratorBuilder.aCollaborator().build();
				const room = RoomBuilder.aRoom().withCustomFields().build();

				expect(createRoomMembership({ room: room as any, member })).toEqual({
					_id: 'generated-id',
					createdAt: date,
					displayName: room.displayName,
					groupMentionsCounter: 0,
					isOpen: true,
					member,
					mustAlert: false,
					name: room.name,
					roomId: room._id,
					type: room.type,
					unreadMessagesCounter: 0,
					userMentionsCounter: 0,
					customFields: room.customFields,
				});
			});
		});
	});
});
