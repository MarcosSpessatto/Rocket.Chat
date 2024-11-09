export interface IUserSettings {
	profile: any;
	preferences?: {
		[key: string]: any;
	};
}

export interface IUserEmail {
	address: string;
	verified?: boolean;
}

export enum UserStatus {
	ONLINE = 'online',
	AWAY = 'away',
	OFFLINE = 'offline',
	BUSY = 'busy',
	DISABLED = 'disabled',
}

export interface IUserDomain {
	_id: string;
	createdAt: Date;
	roles: string[]; // change to Role type
	type: string;
	active: boolean;
	username?: string;
	nickname?: string;
	name?: string;
	// services?: IUserServices;
	emails?: IUserEmail[];
	status?: UserStatus;
	statusConnection?: string;
	lastLoginAt?: Date;
	bio?: string;
	avatarOrigin?: string;
	avatarETag?: string;
	avatarUrl?: string;
	utcOffset?: number;
	language?: string;
	statusDefault?: UserStatus;
	statusText?: string;
	updatedAt: Date;
	requirePasswordChange?: boolean;
	customFields?: {
		[key: string]: any;
	};
	settings?: IUserSettings;
}
