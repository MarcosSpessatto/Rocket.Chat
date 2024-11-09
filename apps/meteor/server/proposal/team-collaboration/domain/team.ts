import type { IMembershipDomain } from './membership.definition';
import { slugifyName, validateRoomName } from './name';
import type { CreateRoomInput } from './room';
import { createPrivateRoomAndMemberships, createPublicRoomAndMemberships } from './room';
import type { ITeamRoomDomain } from './room.definition';

export const createPublicRoomInsideATeam = (
	params: CreateRoomInput & { teamId: string; isTeamDefaultRoom: boolean; isTeamMainRoom: boolean },
): { room: ITeamRoomDomain; memberships: IMembershipDomain[] } => {
	const sanitizedName = params.name.options.shouldAllowSpecialCharactersOnName ? slugifyName(params.name.value) : params.name.value;

	validateRoomName({ name: params.name.value, options: params.name.options });

	const { room, memberships } = createPublicRoomAndMemberships({ ...params, name: { value: sanitizedName, options: params.name.options } });

	return {
		room: {
			...room,
			teamId: params.teamId,
			isTeamDefaultRoom: params.isTeamDefaultRoom,
			isTeamMainRoom: params.isTeamMainRoom,
		},
		memberships: memberships.map((membership) => ({
			...membership,
			isTeamDefaultRoom: params.isTeamDefaultRoom,
			teamId: params.teamId,
			isTeamMainRoom: params.isTeamMainRoom,
		})),
	};
};

export const createPrivateRoomInsideATeam = (
	params: CreateRoomInput & { teamId: string; isTeamDefaultRoom: boolean; isTeamMainRoom: boolean },
): { room: ITeamRoomDomain; memberships: IMembershipDomain[] } => {
	const sanitizedName = params.name.options.shouldAllowSpecialCharactersOnName ? slugifyName(params.name.value) : params.name.value;

	validateRoomName({ name: params.name.value, options: params.name.options });

	const { room, memberships } = createPrivateRoomAndMemberships({
		...params,
		name: { value: sanitizedName, options: params.name.options },
	});

	return {
		room: {
			...room,
			teamId: params.teamId,
			isTeamDefaultRoom: params.isTeamDefaultRoom,
			isTeamMainRoom: params.isTeamMainRoom,
		},
		memberships: memberships.map((membership) => ({
			...membership,
			isTeamDefaultRoom: params.isTeamDefaultRoom,
			teamId: params.teamId,
			isTeamMainRoom: params.isTeamMainRoom,
		})),
	};
};
