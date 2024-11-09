import { DiscussionRoomBuilder } from '../../../../tests/proposal/utils/team-collaboration/discussion-builder';
import {
	createPrivateDiscussionAndMembership,
	createPrivateDiscussionAndMembershipInsideTeam,
	createPublicDiscussionAndMembership,
	createPublicDiscussionAndMembershipInsideTeam,
} from './discussion';

const date = new Date();

jest.useFakeTimers().setSystemTime(date);

jest.mock('@rocket.chat/random', () => ({
	Random: {
		id: jest.fn().mockReturnValue('generated-id'),
	},
}));

describe('Team Collaboration - Domain', () => {
	afterEach(() => jest.restoreAllMocks());

	describe('Discussion', () => {
		describe('#createPublicDiscussionAndMembership()', () => {
			it('should throw an error if parentRoomId was not provided', () => {
				const discussion = DiscussionRoomBuilder.aDiscussion().withMembers([]).build();

				expect(() => createPublicDiscussionAndMembership({ ...discussion, parentRoomId: '' })).toThrow(
					new Error('Cannot create a discussion without a parent room'),
				);
			});

			it('should return a public discussion object with no members and no optional properties', () => {
				const discussion = DiscussionRoomBuilder.aDiscussion().withMembers([]).build();

				expect(createPublicDiscussionAndMembership(discussion)).toEqual({
					room: {
						_id: 'generated-id',
						displayName: discussion.displayName,
						updatedAt: date,
						name: discussion.name,
						type: 'c',
						msgsCounter: 0,
						membersCounter: 1,
						owner: discussion.owner,
						createdAt: date,
						isReadonly: false,
						isBroadcast: undefined,
						parentRoomId: discussion.parentRoomId,
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
							member: discussion.owner,
							roomId: 'generated-id',
							name: discussion.name,
							displayName: discussion.displayName,
							parentRoomId: discussion.parentRoomId,
							type: 'c',
							lastSeenAt: date,
							roles: ['owner'],
						},
					],
				});
			});

			it('should return a public discussion object with members and no optional properties, also lastSeenAt should be defined only for the owner', () => {
				const discussion = DiscussionRoomBuilder.aDiscussion().withMembers().build();

				expect(createPublicDiscussionAndMembership(discussion)).toEqual({
					room: {
						_id: 'generated-id',
						displayName: discussion.displayName,
						updatedAt: date,
						name: discussion.name,
						type: 'c',
						msgsCounter: 0,
						membersCounter: 2,
						owner: discussion.owner,
						createdAt: date,
						isReadonly: false,
						isBroadcast: undefined,
						parentRoomId: discussion.parentRoomId,
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
							member: discussion.members[0],
							roomId: 'generated-id',
							name: discussion.name,
							displayName: discussion.displayName,
							parentRoomId: discussion.parentRoomId,
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
							member: discussion.owner,
							roomId: 'generated-id',
							name: discussion.name,
							displayName: discussion.displayName,
							type: 'c',
							lastSeenAt: date,
							parentRoomId: discussion.parentRoomId,
							roles: ['owner'],
						},
					],
				});
			});

			it('should return a public discussion object with members and all the possible optional properties defined', () => {
				const discussion = DiscussionRoomBuilder.aDiscussion()
					.withMembers()
					.withIsBroadcast(true)
					.withIsCreatingOnBehalfOf(true)
					.withIsReadonly(true)
					.withParentId()
					.withTeamId()
					.build();

				expect(createPublicDiscussionAndMembership(discussion)).toEqual({
					room: {
						_id: 'generated-id',
						displayName: discussion.displayName,
						updatedAt: date,
						name: discussion.name,
						type: 'c',
						msgsCounter: 0,
						membersCounter: 1, // because isCreatingOnBehalfOf = true
						owner: discussion.owner,
						createdAt: date,
						isReadonly: discussion.isReadonly,
						isBroadcast: discussion.isBroadcast,
						parentRoomId: discussion.parentRoomId,
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
							member: discussion.members[0],
							roomId: 'generated-id',
							name: discussion.name,
							displayName: discussion.displayName,
							parentRoomId: discussion.parentRoomId,
							type: 'c',
						},
					],
				});
			});
		});

		describe('#createPrivateDiscussionAndMembership()', () => {
			it('should throw an error if parentRoomId was not provided', () => {
				const discussion = DiscussionRoomBuilder.aDiscussion().withMembers([]).build();

				expect(() => createPrivateDiscussionAndMembership({ ...discussion, parentRoomId: '' })).toThrow(
					new Error('Cannot create a discussion without a parent room'),
				);
			});

			it('should return a private discussion object with no members and no optional properties', () => {
				const discussion = DiscussionRoomBuilder.aDiscussion().withMembers([]).build();

				expect(createPrivateDiscussionAndMembership(discussion)).toEqual({
					room: {
						_id: 'generated-id',
						displayName: discussion.displayName,
						updatedAt: date,
						name: discussion.name,
						type: 'p',
						msgsCounter: 0,
						membersCounter: 1,
						owner: discussion.owner,
						createdAt: date,
						isReadonly: false,
						isBroadcast: undefined,
						parentRoomId: discussion.parentRoomId,
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
							member: discussion.owner,
							roomId: 'generated-id',
							name: discussion.name,
							displayName: discussion.displayName,
							type: 'p',
							lastSeenAt: date,
							parentRoomId: discussion.parentRoomId,
							roles: ['owner'],
						},
					],
				});
			});

			it('should return a private discussion object with members and no optional properties, also lastSeenAt should be defined only for the owner', () => {
				const discussion = DiscussionRoomBuilder.aDiscussion().withMembers().build();

				expect(createPrivateDiscussionAndMembership(discussion)).toEqual({
					room: {
						_id: 'generated-id',
						displayName: discussion.displayName,
						updatedAt: date,
						name: discussion.name,
						type: 'p',
						msgsCounter: 0,
						membersCounter: 2,
						owner: discussion.owner,
						createdAt: date,
						isReadonly: false,
						isBroadcast: undefined,
						parentRoomId: discussion.parentRoomId,
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
							member: discussion.members[0],
							roomId: 'generated-id',
							name: discussion.name,
							displayName: discussion.displayName,
							parentRoomId: discussion.parentRoomId,
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
							member: discussion.owner,
							roomId: 'generated-id',
							name: discussion.name,
							displayName: discussion.displayName,
							type: 'p',
							lastSeenAt: date,
							parentRoomId: discussion.parentRoomId,
							roles: ['owner'],
						},
					],
				});
			});

			it('should return a private discussion object with members and all the possible optional properties defined', () => {
				const discussion = DiscussionRoomBuilder.aDiscussion()
					.withMembers()
					.withIsBroadcast(true)
					.withIsCreatingOnBehalfOf(true)
					.withIsReadonly(true)
					.withParentId()
					.withTeamId()
					.build();

				expect(createPrivateDiscussionAndMembership(discussion)).toEqual({
					room: {
						_id: 'generated-id',
						displayName: discussion.displayName,
						updatedAt: date,
						name: discussion.name,
						type: 'p',
						msgsCounter: 0,
						membersCounter: 1, // because isCreatingOnBehalfOf = true
						owner: discussion.owner,
						createdAt: date,
						isReadonly: discussion.isReadonly,
						isBroadcast: discussion.isBroadcast,
						parentRoomId: discussion.parentRoomId,
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
							member: discussion.members[0],
							roomId: 'generated-id',
							name: discussion.name,
							displayName: discussion.displayName,
							parentRoomId: discussion.parentRoomId,
							type: 'p',
						},
					],
				});
			});
		});

		describe('#createPublicDiscussionAndMembershipInsideTeam()', () => {
			it('should throw an error if parentRoomId was not provided', () => {
				const discussion = DiscussionRoomBuilder.aDiscussion().withMembers([]).build();

				expect(() => createPublicDiscussionAndMembershipInsideTeam({ ...discussion, parentRoomId: '', teamId: '' })).toThrow(
					new Error('Cannot create a discussion without a parent room'),
				);
			});

			it('should throw an error if teamId was not provided', () => {
				const discussion = DiscussionRoomBuilder.aDiscussion().withMembers([]).withParentId().build();

				expect(() => createPublicDiscussionAndMembershipInsideTeam({ ...discussion, teamId: '' })).toThrow(
					new Error('Cannot create a discussion inside a team without a team id'),
				);
			});

			it('should return a public discussion object with no members and no optional properties', () => {
				const discussion = DiscussionRoomBuilder.aDiscussion().withMembers([]).withParentId().withTeamId().build();

				expect(createPublicDiscussionAndMembershipInsideTeam(discussion as any)).toEqual({
					room: {
						_id: 'generated-id',
						displayName: discussion.displayName,
						updatedAt: date,
						name: discussion.name,
						type: 'c',
						msgsCounter: 0,
						membersCounter: 1,
						owner: discussion.owner,
						createdAt: date,
						isReadonly: false,
						isBroadcast: undefined,
						parentRoomId: discussion.parentRoomId,
						teamId: discussion.teamId,
						isTeamMainRoom: false,
						isTeamDefaultRoom: false,
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
							member: discussion.owner,
							roomId: 'generated-id',
							name: discussion.name,
							displayName: discussion.displayName,
							parentRoomId: discussion.parentRoomId,
							teamId: discussion.teamId,
							isTeamMainRoom: false,
							isTeamDefaultRoom: false,
							type: 'c',
							lastSeenAt: date,
							roles: ['owner'],
						},
					],
				});
			});

			it('should return a public discussion object with members and no optional properties, also lastSeenAt should be defined only for the owner', () => {
				const discussion = DiscussionRoomBuilder.aDiscussion().withMembers([]).withParentId().withTeamId().build();

				expect(createPublicDiscussionAndMembershipInsideTeam(discussion as any)).toEqual({
					room: {
						_id: 'generated-id',
						displayName: discussion.displayName,
						updatedAt: date,
						name: discussion.name,
						type: 'c',
						msgsCounter: 0,
						membersCounter: 1,
						owner: discussion.owner,
						createdAt: date,
						isReadonly: false,
						isBroadcast: undefined,
						parentRoomId: discussion.parentRoomId,
						teamId: discussion.teamId,
						isTeamMainRoom: false,
						isTeamDefaultRoom: false,
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
							member: discussion.owner,
							roomId: 'generated-id',
							name: discussion.name,
							displayName: discussion.displayName,
							type: 'c',
							lastSeenAt: date,
							parentRoomId: discussion.parentRoomId,
							teamId: discussion.teamId,
							isTeamDefaultRoom: false,
							isTeamMainRoom: false,
							roles: ['owner'],
						},
					],
				});
			});

			it('should return a public discussion object with members and all the possible optional properties defined', () => {
				const discussion = DiscussionRoomBuilder.aDiscussion()
					.withMembers()
					.withIsBroadcast(true)
					.withIsCreatingOnBehalfOf(true)
					.withIsReadonly(true)
					.withParentId()
					.withTeamId()
					.build();

				expect(createPublicDiscussionAndMembershipInsideTeam(discussion as any)).toEqual({
					room: {
						_id: 'generated-id',
						displayName: discussion.displayName,
						updatedAt: date,
						name: discussion.name,
						type: 'c',
						msgsCounter: 0,
						membersCounter: 1, // because isCreatingOnBehalfOf = true
						owner: discussion.owner,
						createdAt: date,
						isReadonly: discussion.isReadonly,
						isBroadcast: discussion.isBroadcast,
						parentRoomId: discussion.parentRoomId,
						teamId: discussion.teamId,
						isTeamMainRoom: false,
						isTeamDefaultRoom: false,
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
							member: discussion.members[0],
							roomId: 'generated-id',
							name: discussion.name,
							displayName: discussion.displayName,
							parentRoomId: discussion.parentRoomId,
							teamId: discussion.teamId,
							isTeamMainRoom: false,
							isTeamDefaultRoom: false,
							type: 'c',
						},
					],
				});
			});
		});

		describe('#createPrivateDiscussionAndMembershipInsideTeam()', () => {
			it('should throw an error if parentRoomId was not provided', () => {
				const discussion = DiscussionRoomBuilder.aDiscussion().withMembers([]).build();

				expect(() => createPrivateDiscussionAndMembershipInsideTeam({ ...discussion, parentRoomId: '', teamId: '' })).toThrow(
					new Error('Cannot create a discussion without a parent room'),
				);
			});

			it('should throw an error if teamId was not provided', () => {
				const discussion = DiscussionRoomBuilder.aDiscussion().withMembers([]).withParentId().build();

				expect(() => createPrivateDiscussionAndMembershipInsideTeam({ ...discussion, teamId: '' })).toThrow(
					new Error('Cannot create a discussion inside a team without a team id'),
				);
			});

			it('should return a private discussion object with no members and no optional properties', () => {
				const discussion = DiscussionRoomBuilder.aDiscussion().withMembers([]).withParentId().withTeamId().build();

				expect(createPrivateDiscussionAndMembershipInsideTeam(discussion as any)).toEqual({
					room: {
						_id: 'generated-id',
						displayName: discussion.displayName,
						updatedAt: date,
						name: discussion.name,
						type: 'p',
						msgsCounter: 0,
						membersCounter: 1,
						owner: discussion.owner,
						createdAt: date,
						isReadonly: false,
						isBroadcast: undefined,
						parentRoomId: discussion.parentRoomId,
						teamId: discussion.teamId,
						isTeamMainRoom: false,
						isTeamDefaultRoom: false,
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
							member: discussion.owner,
							roomId: 'generated-id',
							name: discussion.name,
							displayName: discussion.displayName,
							type: 'p',
							lastSeenAt: date,
							parentRoomId: discussion.parentRoomId,
							teamId: discussion.teamId,
							isTeamMainRoom: false,
							isTeamDefaultRoom: false,
							roles: ['owner'],
						},
					],
				});
			});

			it('should return a private discussion object with members and no optional properties, also lastSeenAt should be defined only for the owner', () => {
				const discussion = DiscussionRoomBuilder.aDiscussion().withMembers([]).withParentId().withTeamId().build();

				expect(createPrivateDiscussionAndMembershipInsideTeam(discussion as any)).toEqual({
					room: {
						_id: 'generated-id',
						displayName: discussion.displayName,
						updatedAt: date,
						name: discussion.name,
						type: 'p',
						msgsCounter: 0,
						membersCounter: 1,
						owner: discussion.owner,
						createdAt: date,
						isReadonly: false,
						isBroadcast: undefined,
						parentRoomId: discussion.parentRoomId,
						teamId: discussion.teamId,
						isTeamMainRoom: false,
						isTeamDefaultRoom: false,
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
							member: discussion.owner,
							roomId: 'generated-id',
							name: discussion.name,
							displayName: discussion.displayName,
							type: 'p',
							lastSeenAt: date,
							parentRoomId: discussion.parentRoomId,
							teamId: discussion.teamId,
							isTeamMainRoom: false,
							isTeamDefaultRoom: false,
							roles: ['owner'],
						},
					],
				});
			});

			it('should return a private discussion object with members and all the possible optional properties defined', () => {
				const discussion = DiscussionRoomBuilder.aDiscussion()
					.withMembers()
					.withIsBroadcast(true)
					.withIsCreatingOnBehalfOf(true)
					.withIsReadonly(true)
					.withParentId()
					.withTeamId()
					.build();

				expect(createPrivateDiscussionAndMembershipInsideTeam(discussion as any)).toEqual({
					room: {
						_id: 'generated-id',
						displayName: discussion.displayName,
						updatedAt: date,
						name: discussion.name,
						type: 'p',
						msgsCounter: 0,
						membersCounter: 1, // because isCreatingOnBehalfOf = true
						owner: discussion.owner,
						createdAt: date,
						isReadonly: discussion.isReadonly,
						isBroadcast: discussion.isBroadcast,
						parentRoomId: discussion.parentRoomId,
						teamId: discussion.teamId,
						isTeamMainRoom: false,
						isTeamDefaultRoom: false,
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
							member: discussion.members[0],
							roomId: 'generated-id',
							name: discussion.name,
							displayName: discussion.displayName,
							parentRoomId: discussion.parentRoomId,
							teamId: discussion.teamId,
							isTeamMainRoom: false,
							isTeamDefaultRoom: false,
							type: 'p',
						},
					],
				});
			});
		});
	});
});
