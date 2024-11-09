type VoipMessageTypesValues =
	| 'voip-call-started'
	| 'voip-call-declined'
	| 'voip-call-on-hold'
	| 'voip-call-unhold'
	| 'voip-call-ended'
	| 'voip-call-duration'
	| 'voip-call-wrapup'
	| 'voip-call-ended-unexpectedly';
type TeamMessageTypes =
	| 'removed-user-from-team'
	| 'added-user-to-team'
	| 'ult'
	| 'user-converted-to-team'
	| 'user-converted-to-channel'
	| 'user-removed-room-from-team'
	| 'user-deleted-room-from-team'
	| 'user-added-room-to-team'
	| 'ujt';
type LivechatMessageTypes =
	| 'livechat_navigation_history'
	| 'livechat_transfer_history'
	| 'omnichannel_priority_change_history'
	| 'omnichannel_sla_change_history'
	| 'livechat_transcript_history'
	| 'livechat_video_call'
	| 'livechat_transfer_history_fallback'
	| 'livechat-close'
	| 'livechat_webrtc_video_call'
	| 'livechat-started';
type OmnichannelTypesValues = 'omnichannel_placed_chat_on_hold' | 'omnichannel_on_hold_chat_resumed';
type OtrMessageTypeValues = 'otr' | 'otr-ack';
type OtrSystemMessages = 'user_joined_otr' | 'user_requested_otr_key_refresh' | 'user_key_refreshed_successfully';
type MessageTypesValues =
	| 'e2e'
	| 'uj'
	| 'ul'
	| 'ru'
	| 'au'
	| 'mute_unmute'
	| 'r'
	| 'ut'
	| 'wm'
	| 'rm'
	| 'subscription-role-added'
	| 'subscription-role-removed'
	| 'room-archived'
	| 'room-unarchived'
	| 'room_changed_privacy'
	| 'room_changed_description'
	| 'room_changed_announcement'
	| 'room_changed_avatar'
	| 'room_changed_topic'
	| 'room_e2e_enabled'
	| 'room_e2e_disabled'
	| 'user-muted'
	| 'user-unmuted'
	| 'room-removed-read-only'
	| 'room-set-read-only'
	| 'room-allowed-reacting'
	| 'room-disallowed-reacting'
	| 'command'
	| 'videoconf'
	| 'message_pinned'
	| 'new-moderator'
	| 'moderator-removed'
	| 'new-owner'
	| 'owner-removed'
	| 'new-leader'
	| 'leader-removed'
	| 'discussion-created'
	| LivechatMessageTypes
	| TeamMessageTypes
	| VoipMessageTypesValues
	| OmnichannelTypesValues
	| OtrMessageTypeValues
	| OtrSystemMessages;

export type RoomType = 'c' | 'd' | 'p' | 'l' | 'v';
export interface IRoomDomain {
	_id: string;
	type: RoomType;
	name: string;
	displayName?: string;
	msgsCounter: number;
	isDefault?: boolean;
	isBroadcast?: boolean;
	isFeatured?: boolean;
	isJoinCodeRequired?: boolean;
	announcement?: string;
	announcementDetails?: {
		style?: string;
	};
	isEncrypted?: boolean;
	topic?: string;

	canReactWhenReadOnly?: boolean;

	// TODO: this boolean might be an accident
	hiddenSystemMessages?: MessageTypesValues[] | boolean;

	owner: any;
	//  u: Pick<IUser, '_id' | 'un' | 'name'>;
	membersIds?: Array<string>;

	lastMessageSent?: any;
	//  lastMessage?: IMessage;
	lastMessageTimestamp?: Date;
	membersCounter: number;

	isOpen?: boolean;

	autoTranslateLanguage?: string;
	shouldAutoTranslate?: boolean;
	unreadCounter?: number;
	mustAlert?: boolean;
	mustHideUnreadStatus?: boolean;
	mustHideMentionStatus?: boolean;

	mutedMemberUsernames?: string[];
	unmutedMemberUsernames?: string[];

	memberUsernames?: string[];
	createdAt?: Date;
	updatedAt?: Date;

	cl?: boolean; // Check with domain expert what is this?
	isReadonly?: boolean;
	isFavorited?: boolean;
	isArchived?: boolean;
	description?: string;
	wasCreatedOTRSession?: boolean;
	e2eKeyId?: string;

	/* @deprecated */
	isFederated?: boolean;
	/* @deprecated */
	customFields?: Record<string, any>;

	channel?: { _id: string };
}

export interface IDiscussionRoomDomain extends IRoomDomain {
	parentRoomId: string;
}
export interface ITeamDiscussionRoomDomain extends IRoomDomain {
	parentRoomId: string;
	teamId: string;
	isTeamMainRoom: boolean;
	isTeamDefaultRoom: boolean;
}

export interface ITeamRoomDomain extends IRoomDomain {
	isTeamMainRoom: boolean;
	teamId: string;
	isTeamDefaultRoom: boolean;
}
