import { SolitaryUnitTestFactory } from '@rocket.chat/fuel/dist/testing';
import { TeamCollaborationExternalModuleConsumer } from './team-collaboration';
import { FUEL_DI_TOKENS, IInternalEphemeralMessagingRegistrar } from '@rocket.chat/fuel';

describe('[Infrastructure]', () => {

    describe('[external-module-integration] - TeamCollaborationExternalModuleConsumer', () => {

        describe('#stopEventListeners()', () => {
            let instance: TeamCollaborationExternalModuleConsumer;
            let messagingDep: jest.Mocked<IInternalEphemeralMessagingRegistrar>;
            const publicRoomCreatedFn = jest.fn();

            beforeAll(async () => {
                const { instance: teamCollabModule, dependenciesAdapter } = await SolitaryUnitTestFactory.create(TeamCollaborationExternalModuleConsumer);
                instance = teamCollabModule;
                messagingDep = dependenciesAdapter.get<IInternalEphemeralMessagingRegistrar>(FUEL_DI_TOKENS.INTERNAL_EPHEMERAL_MESSAGING_REGISTRAR);
                messagingDep.registerConsumer.mockImplementation((topic: string, _: (event: any) => Promise<void>, __: any) => {
                    const map: Record<string, any> = {
                        'team-collaboration.public-room-created': { cancel: publicRoomCreatedFn }
                    }

                    return map[topic];
                })
            });

            afterAll(() => jest.restoreAllMocks());

            it('should cancel all the registered events', async () => {
                await instance.registerEvents();
                await instance.stopEventListeners();

                expect(publicRoomCreatedFn).toHaveBeenCalledTimes(1);
            });
        })

    })
});