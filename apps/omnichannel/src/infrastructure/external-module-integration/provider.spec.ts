import { SolitaryUnitTestFactory } from '@rocket.chat/fuel/dist/testing';
import { FUEL_DI_TOKENS, IInternalRPCAdapter, IInternalRPCServiceRegistrar } from '@rocket.chat/fuel';
import { OmnichannelModuleProvider } from './provider';

describe('[Infrastructure]', () => {

    describe('[external-module-integration] - OmnichannelModuleProvider', () => {

        describe('#getOmnichannelRPCServiceInstance()', () => {
            let instance: OmnichannelModuleProvider;
            let rpcAdapterDep: jest.Mocked<IInternalRPCAdapter>;
            const rpcServiceMockedValue = { registerAction: jest.fn() } as IInternalRPCServiceRegistrar

            beforeAll(async () => {
                const { instance: teamCollabModule, dependenciesAdapter } = await SolitaryUnitTestFactory.create(OmnichannelModuleProvider);
                instance = teamCollabModule;
                rpcAdapterDep = dependenciesAdapter.get<IInternalRPCAdapter>(FUEL_DI_TOKENS.INTERNAL_RPC_ADAPTER);
                rpcAdapterDep.createRPCService.mockResolvedValue(rpcServiceMockedValue);
            });

            afterAll(() => jest.restoreAllMocks());

            it('should throw an error if the service was not registered yet', async () => {
                expect(() => instance.getOmnichannelRPCServiceInstance()).toThrow(new Error('Omnichannel Service is not registered yet'));
            });

            it('should return the registrar instance when the service was created correctly', async () => {
                await instance.registerActions();

                expect(instance.getOmnichannelRPCServiceInstance()).toBe(rpcServiceMockedValue);
            });
        });

        describe('#deleteServices()', () => {
            let instance: OmnichannelModuleProvider;
            let rpcAdapterDep: jest.Mocked<IInternalRPCAdapter>;

            beforeAll(async () => {
                const { instance: teamCollabModule, dependenciesAdapter } = await SolitaryUnitTestFactory.create(OmnichannelModuleProvider);
                instance = teamCollabModule;
                rpcAdapterDep = dependenciesAdapter.get<IInternalRPCAdapter>(FUEL_DI_TOKENS.INTERNAL_RPC_ADAPTER);
            });

            afterAll(() => jest.restoreAllMocks());

            it('should delete the service when called', async () => {
                await instance.deleteServices();

                expect(rpcAdapterDep.deleteRPCService).toHaveBeenCalledWith('omnichannel');
            });
        })

    })
});