import { SolitaryUnitTestFactory } from '@rocket.chat/fuel/dist/testing';

import type { RoomService } from '../../services/room/room';
import { TeamCollaborationModuleProvider } from './provider';

describe('Team Collaboration', () => {
	describe('[Infrastructure]', () => {
		describe('[external-module-integration] - TeamCollaborationExternalModuleProvider', () => {
			describe('#createRoomAndMembership()', () => {
				let instance: TeamCollaborationModuleProvider;
				let roomService: jest.Mocked<RoomService>;

				beforeAll(async () => {
					const { instance: teamCollabModule, dependenciesAdapter } = await SolitaryUnitTestFactory.create(TeamCollaborationModuleProvider);
					instance = teamCollabModule;
					roomService = dependenciesAdapter.get<RoomService>('RoomService');
				});

				afterEach(() => jest.resetAllMocks());

				it('should throw an error if the type was not provided', async () => {
					try {
						await instance.createRoomAndMembership({} as any);
					} catch (e: any) {
						expect(e.message).toBe('Room type was not provided');
					}
				});

				it('should throw an error if the type is provided but its one different than the module can handle', async () => {
					try {
						await instance.createRoomAndMembership({ type: 'd' } as any);
					} catch (e: any) {
						expect(e.message).toBe('Room type was not supported yet');
					}
				});

				it('should call the correct handler when creating a channel', async () => {
					await instance.createRoomAndMembership({ type: 'c' } as any);

					expect(roomService.createPublicRoomAndMembership).toHaveBeenCalledTimes(1);
				});

				it('should call the correct handler when creating a group', async () => {
					await instance.createRoomAndMembership({ type: 'p' } as any);

					expect(roomService.createPrivateRoomAndMembership).toHaveBeenCalledTimes(1);
				});

				it('should call the correct handler when creating a discussion inside of a channel', async () => {
					await instance.createRoomAndMembership({ type: 'c', parentRoomId: 'id' } as any);

					expect(roomService.createPublicDiscussionAndMembership).toHaveBeenCalledTimes(1);
				});

				it('should call the correct handler when creating a discussion inside of a group', async () => {
					await instance.createRoomAndMembership({ type: 'p', parentRoomId: 'id' } as any);

					expect(roomService.createPrivateDiscussionAndMembership).toHaveBeenCalledTimes(1);
				});

				it('should call the correct handler when creating a dicussion inside of a public team', async () => {
					await instance.createRoomAndMembership({ type: 'c', parentRoomId: 'id', teamId: 'id' } as any);

					expect(roomService.createPublicDiscussionRoomAndMembershipInsideTeam).toHaveBeenCalledTimes(1);
				});

				it('should call the correct handler when creating a dicussion inside of a private team', async () => {
					await instance.createRoomAndMembership({ type: 'p', parentRoomId: 'id', teamId: 'id' } as any);

					expect(roomService.createPrivateDiscussionRoomAndMembershipInsideTeam).toHaveBeenCalledTimes(1);
				});

				it('should call the correct handler when creating a channel inside of a public team', async () => {
					await instance.createRoomAndMembership({ type: 'c', teamId: 'id' } as any);

					expect(roomService.createPublicRoomAndMembershipInsideTeam).toHaveBeenCalledTimes(1);
				});

				it('should call the correct handler when creating a group inside of a public team', async () => {
					await instance.createRoomAndMembership({ type: 'p', teamId: 'id' } as any);

					expect(roomService.createPrivateRoomAndMembershipInsideTeam).toHaveBeenCalledTimes(1);
				});
			});
		});
	});
});
