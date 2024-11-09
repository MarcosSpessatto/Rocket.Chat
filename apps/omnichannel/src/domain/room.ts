import { Random } from '@rocket.chat/random';

import type { IOmnichannelRoomDomain } from './definition';

export type CreateRoomInput = {
	name: string;
	exampleIds: string[];
	example?: string;
	when?: Date;
};

export const createRoom = ({ exampleIds, name, example, when }: CreateRoomInput): IOmnichannelRoomDomain => ({
	_id: Random.id(),
	membersCounter: 1,
	msgsCounter: 0,
	type: 'l',
	name,
	owner: {},
	displayName: example || '',
	membersIds: exampleIds,
	createdAt: when,
});
