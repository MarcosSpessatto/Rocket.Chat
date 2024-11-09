import { DBEntity } from '@rocket.chat/fuel';

type RoomType = 'c' | 'd' | 'p' | 'l' | 'v';
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

export class RoomModel extends DBEntity {
	public _id: string;

	public t: RoomType;

	public name?: string;

	public fname?: string;

	public msgs: number;

	public default?: boolean;

	public broadcast?: boolean;

	public featured?: boolean;

	public announcement?: string;

	public joinCodeRequired?: boolean;

	public announcementDetails?: {
		style?: string;
	};

	public encrypted?: boolean;

	public topic?: string;

	public reactWhenReadOnly?: boolean;

	// TODO: this boolean might be an accident
	public sysMes?: MessageTypesValues[] | boolean;

	public u: any;

	// public u: Pick<IUser, '_id' | 'un' | 'name'>;
	public uids?: Array<string>;

	public lastMessage?: any;

	// public lastMessage?: IMessage;
	public lm?: Date;

	public usersCount: number;

	public callStatus?: any;

	// public callStatus?: CallStatus;
	public webRtcCallStartTime?: Date;

	public servedBy?: {
		_id: string;
	};

	public streamingOptions?: {
		id?: string;
		type?: string;
		url?: string;
		thumbnail?: string;
		isAudioOnly?: boolean;
		message?: string;
	};

	public prid?: string;

	public avatarETag?: string;

	public teamMain?: boolean;

	public teamId?: string;

	public teamDefault?: boolean;

	public open?: boolean;

	public autoTranslateLanguage?: string;

	public autoTranslate?: boolean;

	public unread?: number;

	public alert?: boolean;

	public hideUnreadStatus?: boolean;

	public hideMentionStatus?: boolean;

	public muted?: string[];

	public unmuted?: string[];

	public usernames?: string[];

	public ts?: Date;

	public _updatedAt?: Date;

	public cl?: boolean;

	public ro?: boolean;

	public favorite?: boolean;

	public archived?: boolean;

	public description?: string;

	public createdOTR?: boolean;

	public e2eKeyId?: string;

	/* @deprecated */
	public federated?: boolean;

	/* @deprecated */
	public customFields?: Record<string, any>;

	public channel?: { _id: string };

	public static getStorageName(): string {
		return 'rocketchat_room';
	}
}
