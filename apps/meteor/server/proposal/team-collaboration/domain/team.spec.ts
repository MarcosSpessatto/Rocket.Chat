import { RoomBuilder } from '../../../../tests/proposal/utils/team-collaboration/room-builder';
import { createPrivateRoomInsideATeam, createPublicRoomInsideATeam } from './team';

const date = new Date();

jest.useFakeTimers().setSystemTime(date);

jest.mock('@rocket.chat/random', () => ({
	Random: {
		id: jest.fn().mockReturnValue('generated-id'),
	},
}));

describe('Team Collaboration - Domain', () => {
	afterEach(() => jest.restoreAllMocks());

	describe('Team', () => {
		describe('#createPublicRoomInsideATeam()', () => {
			it('should return the room and its memberships', () => {
				const room = RoomBuilder.aRoom().withTeamId().withTeamDefaultRoom(true).withTeamMainRoom(true).build();

				expect(createPublicRoomInsideATeam({ ...room, name: { value: room.name, options: {} as any } } as any)).toEqual({
					room: {
						_id: 'generated-id',
						displayName: room.name,
						updatedAt: date,
						name: room.name,
						type: 'c',
						msgsCounter: 0,
						membersCounter: 2,
						owner: room.owner,
						createdAt: date,
						isReadonly: false,
						isBroadcast: room.isBroadcast,
						teamId: room.teamId,
						isTeamMainRoom: true,
						isTeamDefaultRoom: true,
					},
					memberships: [
						{
							_id: 'generated-id',
							isOpen: true,
							mustAlert: false,
							unreadMessagesCounter: 0,
							userMentionsCounter: 0,
							groupMentionsCounter: 0,
							createdAt: date,
							member: room.members[0],
							roomId: 'generated-id',
							name: room.name,
							displayName: room.name,
							type: 'c',
							teamId: room.teamId,
							isTeamMainRoom: true,
							isTeamDefaultRoom: true,
						},
						{
							_id: 'generated-id',
							isOpen: true,
							mustAlert: false,
							unreadMessagesCounter: 0,
							userMentionsCounter: 0,
							groupMentionsCounter: 0,
							createdAt: date,
							member: room.owner,
							roomId: 'generated-id',
							name: room.name,
							displayName: room.name,
							type: 'c',
							lastSeenAt: date,
							roles: ['owner'],
							teamId: room.teamId,
							isTeamMainRoom: true,
							isTeamDefaultRoom: true,
						},
					],
				});
			});
		});

		describe('#createPrivateRoomInsideATeam()', () => {
			it('should return the room and its memberships', () => {
				const room = RoomBuilder.aRoom().withTeamId().withTeamDefaultRoom(true).withTeamMainRoom(true).build();

				expect(createPrivateRoomInsideATeam({ ...room, name: { value: room.name, options: {} as any } } as any)).toEqual({
					room: {
						_id: 'generated-id',
						displayName: room.name,
						updatedAt: date,
						name: room.name,
						type: 'p',
						msgsCounter: 0,
						membersCounter: 2,
						owner: room.owner,
						createdAt: date,
						isReadonly: false,
						isBroadcast: room.isBroadcast,
						teamId: room.teamId,
						isTeamMainRoom: true,
						isTeamDefaultRoom: true,
					},
					memberships: [
						{
							_id: 'generated-id',
							isOpen: true,
							mustAlert: false,
							unreadMessagesCounter: 0,
							userMentionsCounter: 0,
							groupMentionsCounter: 0,
							createdAt: date,
							member: room.members[0],
							roomId: 'generated-id',
							name: room.name,
							displayName: room.name,
							type: 'p',
							teamId: room.teamId,
							isTeamMainRoom: true,
							isTeamDefaultRoom: true,
						},
						{
							_id: 'generated-id',
							isOpen: true,
							mustAlert: false,
							unreadMessagesCounter: 0,
							userMentionsCounter: 0,
							groupMentionsCounter: 0,
							createdAt: date,
							member: room.owner,
							roomId: 'generated-id',
							name: room.name,
							displayName: room.name,
							type: 'p',
							lastSeenAt: date,
							roles: ['owner'],
							teamId: room.teamId,
							isTeamMainRoom: true,
							isTeamDefaultRoom: true,
						},
					],
				});
			});
		});
	});
});
