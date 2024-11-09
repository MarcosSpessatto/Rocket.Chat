import { RoomBuilder } from '../../../../tests/proposal/utils/team-collaboration/room-builder';
import {
	createPrivateRoomAndMemberships,
	createPublicRoomAndMemberships,
	createRoomAndMembership,
	isDiscussionRoom,
	isPrivateRoom,
	isPublicRoom,
} from './room';

const date = new Date();

jest.useFakeTimers().setSystemTime(date);

jest.mock('@rocket.chat/random', () => ({
	Random: {
		id: jest.fn().mockReturnValue('generated-id'),
	},
}));

describe('Team Collaboration - Domain', () => {
	afterEach(() => jest.restoreAllMocks());

	describe('Room', () => {
		describe('#createRoomAndMembership()', () => {
			it('should include the owner as a member if they are not creating the room on behalf of someone', () => {
				const room = RoomBuilder.aRoom().withType('c').withMembers([]).build();

				expect(createRoomAndMembership(room as any)).toEqual({
					room: {
						_id: 'generated-id',
						displayName: room.displayName,
						updatedAt: date,
						name: room.name,
						type: room.type,
						msgsCounter: 0,
						membersCounter: 1,
						owner: room.owner,
						createdAt: date,
						isReadonly: false,
						isBroadcast: room.isBroadcast,
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
							member: room.owner,
							roomId: 'generated-id',
							name: room.name,
							displayName: room.displayName,
							type: room.type,
							lastSeenAt: date,
							roles: ['owner'],
						},
					],
				});
			});

			it('should NOT include the owner as a member if they are creating the room on behalf of someone', () => {
				const room = RoomBuilder.aRoom().withType('c').withIsCreatingOnBehalfOf(true).build();

				expect(createRoomAndMembership(room as any)).toEqual({
					room: {
						_id: 'generated-id',
						displayName: room.displayName,
						updatedAt: date,
						name: room.name,
						type: room.type,
						msgsCounter: 0,
						membersCounter: 1,
						owner: room.owner,
						createdAt: date,
						isReadonly: false,
						isBroadcast: room.isBroadcast,
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
							displayName: room.displayName,
							type: room.type,
						},
					],
				});
			});

			it('should mark the room as readonly if the isReadonly param was provided', () => {
				const room = RoomBuilder.aRoom().withType('c').withIsReadonly(true).build();

				expect(createRoomAndMembership(room as any)).toEqual({
					room: {
						_id: 'generated-id',
						displayName: room.displayName,
						updatedAt: date,
						name: room.name,
						type: room.type,
						msgsCounter: 0,
						membersCounter: 2,
						owner: room.owner,
						createdAt: date,
						isReadonly: true,
						isBroadcast: room.isBroadcast,
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
							displayName: room.displayName,
							type: 'c',
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
							displayName: room.displayName,
							type: 'c',
							lastSeenAt: date,
							roles: ['owner'],
						},
					],
				});
			});

			it('should mark the room as readonly if the isReadonly param was NOT provided, but isBroadcast was', () => {
				const room = RoomBuilder.aRoom().withType('c').withIsBroadcast(true).build();

				expect(createRoomAndMembership(room as any)).toEqual({
					room: {
						_id: 'generated-id',
						displayName: room.displayName,
						updatedAt: date,
						name: room.name,
						type: room.type,
						msgsCounter: 0,
						membersCounter: 2,
						owner: room.owner,
						createdAt: date,
						isReadonly: true,
						isBroadcast: room.isBroadcast,
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
							displayName: room.displayName,
							type: 'c',
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
							displayName: room.displayName,
							type: 'c',
							lastSeenAt: date,
							roles: ['owner'],
						},
					],
				});
			});
		});

		describe('#createPublicRoomAndMemberships()', () => {
			it('should return the room and its memberships', () => {
				const room = RoomBuilder.aRoom().build();

				expect(createPublicRoomAndMemberships({ ...room, name: { value: room.name, options: {} as any } })).toEqual({
					room: {
						_id: 'generated-id',
						displayName: room.name,
						updatedAt: date,
						name: room.name,
						type: room.type,
						msgsCounter: 0,
						membersCounter: 2,
						owner: room.owner,
						createdAt: date,
						isReadonly: false,
						isBroadcast: room.isBroadcast,
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
						},
					],
				});
			});
		});

		describe('#createPrivateRoomAndMemberships()', () => {
			it('should return the room and its memberships', () => {
				const room = RoomBuilder.aRoom().build();

				expect(createPrivateRoomAndMemberships({ ...room, name: { value: room.name, options: {} as any } })).toEqual({
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
						},
					],
				});
			});
		});

		describe('#isPublicRoom()', () => {
			it('should return false when the room type is not public', () => {
				expect(isPublicRoom({ type: 'p' })).toBe(false);
			});

			it('should return true when the room type is public', () => {
				expect(isPublicRoom({ type: 'c' })).toBe(true);
			});
		});

		describe('#isPrivateRoom()', () => {
			it('should return false when the room type is not private', () => {
				expect(isPrivateRoom({ type: 'c' })).toBe(false);
			});

			it('should return true when the room type is private', () => {
				expect(isPrivateRoom({ type: 'p' })).toBe(true);
			});
		});

		describe('#isDiscussionRoom()', () => {
			it('should return false when the room is not a discussion', () => {
				expect(isDiscussionRoom({})).toBe(false);
			});

			it('should return true when the room type is private', () => {
				expect(isDiscussionRoom({ parentRoomId: 'id' })).toBe(true);
			});
		});
	});
});
