import { DBEntity } from '@rocket.chat/fuel';

export interface IUserSettings {
	profile: any;
	preferences?: {
		[key: string]: any;
	};
}

export class UserModel extends DBEntity {
	_id: string;

	createdAt: Date;

	roles: string[];

	type: string;

	active: boolean;

	username?: string;

	nickname?: string;

	name?: string;

	// services?: IUserServices;
	emails?: string[];

	status?: string;

	statusConnection?: string;

	lastLogin?: Date;

	bio?: string;

	avatarOrigin?: string;

	avatarETag?: string;

	avatarUrl?: string;

	utcOffset?: number;

	language?: string;

	statusDefault?: string;

	statusText?: string;

	oauth?: {
		authorizedClients: string[];
	};

	_updatedAt: Date;

	requirePasswordChange?: boolean;

	customFields?: {
		[key: string]: any;
	};

	settings?: IUserSettings;

	public static getStorageName(): string {
		return 'users';
	}
}
