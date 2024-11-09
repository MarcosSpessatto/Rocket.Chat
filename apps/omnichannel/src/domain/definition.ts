export interface IOmnichannelRoomDomain {
	_id: string;
	type: 'l';
	name: string;
	displayName?: string;
	msgsCounter: number;
	isDefault?: boolean;
	isBroadcast?: true;
	isFeatured?: true;
	isJoinCodeRequired?: boolean;
	announcement?: string;
	announcementDetails?: {
		style?: string;
	};
	isEncrypted?: boolean;
	topic?: string;

	canReactWhenReadOnly?: boolean;

	owner: any;
	//  u: Pick<IUser, '_id' | 'un' | 'name'>;
	membersIds?: Array<string>;

	lastMessageSent?: any;
	//  lastMessage?: IMessage;
	lastMessageTimestamp?: Date;
	createdAt?: Date;
	membersCounter: number;
}
