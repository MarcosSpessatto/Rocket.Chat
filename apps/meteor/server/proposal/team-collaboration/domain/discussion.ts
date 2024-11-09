import type { IMembershipDomain } from './membership.definition';
import type { CreateRoomAndMembershipInput } from './room';
import { createRoomAndMembership } from './room';
import type { IDiscussionRoomDomain, ITeamDiscussionRoomDomain } from './room.definition';

type CreateDiscussionInput = {
	parentRoomId: string;
	displayName: string;
} & CreateRoomAndMembershipInput;

// TODO: Discussion must include the business logic related to discussion creation, this is only the room part, this will be doing incrementally
export const createPublicDiscussionAndMembership = (
	params: CreateDiscussionInput,
): { room: IDiscussionRoomDomain; memberships: IMembershipDomain[] } => {
	if (!params.parentRoomId) {
		throw new Error('Cannot create a discussion without a parent room');
	}
	const { room, memberships } = createRoomAndMembership({ ...params, type: 'c' });

	return {
		room: { ...room, parentRoomId: params.parentRoomId },
		memberships: memberships.map((membership) => ({ ...membership, parentRoomId: params.parentRoomId })),
	};
};
export const createPrivateDiscussionAndMembership = (
	params: CreateDiscussionInput,
): { room: IDiscussionRoomDomain; memberships: IMembershipDomain[] } => {
	if (!params.parentRoomId) {
		throw new Error('Cannot create a discussion without a parent room');
	}
	const { room, memberships } = createRoomAndMembership({ ...params, type: 'p' });

	return {
		room: { ...room, parentRoomId: params.parentRoomId },
		memberships: memberships.map((membership) => ({ ...membership, parentRoomId: params.parentRoomId })),
	};
};

export const createPublicDiscussionAndMembershipInsideTeam = (
	params: CreateDiscussionInput & { teamId: string },
): { room: ITeamDiscussionRoomDomain; memberships: IMembershipDomain[] } => {
	if (!params.parentRoomId) {
		throw new Error('Cannot create a discussion without a parent room');
	}
	if (!params.teamId) {
		throw new Error('Cannot create a discussion inside a team without a team id');
	}
	const { room, memberships } = createRoomAndMembership({ ...params, type: 'c' });

	return {
		room: { ...room, parentRoomId: params.parentRoomId, teamId: params.teamId, isTeamMainRoom: false, isTeamDefaultRoom: false },
		memberships: memberships.map((membership) => ({
			...membership,
			parentRoomId: params.parentRoomId,
			isTeamDefaultRoom: false,
			teamId: params.teamId,
			isTeamMainRoom: false,
		})),
	};
};

export const createPrivateDiscussionAndMembershipInsideTeam = (
	params: CreateDiscussionInput & { teamId: string },
): { room: ITeamDiscussionRoomDomain; memberships: IMembershipDomain[] } => {
	if (!params.parentRoomId) {
		throw new Error('Cannot create a discussion without a parent room');
	}
	if (!params.teamId) {
		throw new Error('Cannot create a discussion inside a team without a team id');
	}
	const { room, memberships } = createRoomAndMembership({ ...params, type: 'p' });

	return {
		room: { ...room, parentRoomId: params.parentRoomId, teamId: params.teamId, isTeamMainRoom: false, isTeamDefaultRoom: false },
		memberships: memberships.map((membership) => ({
			...membership,
			parentRoomId: params.parentRoomId,
			isTeamDefaultRoom: false,
			teamId: params.teamId,
			isTeamMainRoom: false,
		})),
	};
};
