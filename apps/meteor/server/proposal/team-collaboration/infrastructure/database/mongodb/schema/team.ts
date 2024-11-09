import { DBEntity } from '@rocket.chat/fuel';

export class TeamModel extends DBEntity {
	_id: string;

	name: string;

	type: string;

	roomId: string;

	createdBy: any;

	createdAt: Date;

	public static getStorageName(): string {
		return 'rocketchat_team';
	}
}
