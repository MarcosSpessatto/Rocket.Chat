interface IUserSubscription {
	_id: string;
	username: string;
	name?: string;
}

export interface ISubscription {
	_id: string;
	open: boolean;
	alert: boolean;
	unread: number;
	userMentions: number;
	groupMentions: number;
	ts: Date;
	rid: string;
	name: string;
	t: string;
	u: IUserSubscription;
	_updatedAt: Date;
	roles: string[];
}
