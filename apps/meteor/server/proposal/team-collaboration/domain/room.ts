import { Random } from '@rocket.chat/random';

import type { Member, Owner } from './collaborators';
import { createRoomMembership } from './membership';
import type { IMembershipDomain } from './membership.definition';
import type { NameValidationOptions } from './name';
import { slugifyName, validateRoomName } from './name';
import type { IRoomDomain, RoomType } from './room.definition';

type BasicRoomProperties = {
	owner: Owner;
	members: Member[];
	isReadonly?: boolean;
	isBroadcast?: boolean;
	isCreatingOnBehalfOf?: boolean;
};

export type CreateRoomInput = {
	name: {
		value: string;
		options: NameValidationOptions & { shouldAllowSpecialCharactersOnName?: boolean };
	};
} & BasicRoomProperties;

export type CreateRoomAndMembershipInput = {
	name: string;
} & BasicRoomProperties;

export const createRoomAndMembership = ({
	name,
	displayName,
	type,
	isReadonly,
	owner,
	members,
	isCreatingOnBehalfOf,
	isBroadcast,
}: CreateRoomAndMembershipInput & { type: RoomType; displayName: string }): { room: IRoomDomain; memberships: IMembershipDomain[] } => {
	const now = new Date();
	const finalMemberList = [...members];
	const isAlreadyInTheMemberList = members.some((member) => member.username === owner.username);

	if (!isCreatingOnBehalfOf && owner.username && !isAlreadyInTheMemberList) {
		finalMemberList.push(owner);
	}

	const room = {
		_id: Random.id(),
		displayName,
		updatedAt: now,
		name,
		type,
		msgsCounter: 0,
		membersCounter: finalMemberList.length,
		owner,
		createdAt: now,
		isReadonly: isReadonly === true || isBroadcast === true,
		isBroadcast,
	};

	return {
		room,
		memberships: finalMemberList.map((member) => createRoomMembership({ room, member })),
	};
};

export const createPublicRoomAndMemberships = (params: CreateRoomInput): { room: IRoomDomain; memberships: IMembershipDomain[] } => {
	const sanitizedName = params.name.options.shouldAllowSpecialCharactersOnName ? slugifyName(params.name.value) : params.name.value;

	validateRoomName({ name: params.name.value, options: params.name.options });

	return createRoomAndMembership({ ...params, name: sanitizedName, displayName: sanitizedName, type: 'c' });
};

export const createPrivateRoomAndMemberships = (params: CreateRoomInput): { room: IRoomDomain; memberships: IMembershipDomain[] } => {
	const sanitizedName = params.name.options.shouldAllowSpecialCharactersOnName ? slugifyName(params.name.value) : params.name.value;

	validateRoomName({ name: params.name.value, options: params.name.options });

	return createRoomAndMembership({ ...params, name: sanitizedName, displayName: sanitizedName, type: 'p' });
};

export const isPublicRoom = ({ type }: { type: string }): boolean => type === 'c';
export const isPrivateRoom = ({ type }: { type: string }): boolean => type === 'p';
export const isDiscussionRoom = ({ parentRoomId }: { parentRoomId?: string }): boolean => parentRoomId !== undefined;
