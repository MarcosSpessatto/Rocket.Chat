import { DomainEvent } from '@rocket.chat/fuel';

import type { Owner } from '../collaborators';

type PublicRoomCreatedPayload = {
	_id: string;
	name: string;
	owner: Owner;
};

export class PublicRoomCreated extends DomainEvent<PublicRoomCreatedPayload> {
	public name = 'team-collaboration.public-room-created';

	public payload: PublicRoomCreatedPayload;

	constructor(payload: PublicRoomCreatedPayload) {
		super();
		this.payload = payload;
	}
}
