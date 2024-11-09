import { IInternalRPCClient } from '@rocket.chat/fuel';
import { TeamCollaborationExternalModuleConsumer } from '../../src/infrastructure/external-module-integration/consumer/team-collaboration';
import { buildModule } from '../../src/omnichannel.module';

import { IntegrationTestFactory, IntegrationTestApplication, MongoDBContainerBuilder } from "@rocket.chat/fuel/dist/testing";
import { CreateRoomInput } from '../../src/domain/room';
import { IOmnichannelRoomDomain } from '../../src/domain/definition';

const envVars = {
    NODE_ENV: 'test',
    MONGO_URL: 'mongodb://localhost:27017/rocketchat?directConnection=true',
    INTER_COMMUNICATION_DRIVER: 'moleculer',
    INTER_COMMUNICATION_DRIVER_URL: 'TCP',
    TELEMETRY_LOGS_EXPORTER_URL: 'http://localhost:4318/v1/logs',
    TELEMETRY_METRICS_EXPORTER_URL: 'http://localhost:4318/v1/metrics',
    TELEMETRY_TRACING_EXPORTER_URL: 'http://localhost:4318/v1/traces',
}

describe('Integration', () => {
    jest.setTimeout(60000);

    const container: MongoDBContainerBuilder = new MongoDBContainerBuilder({ image: 'mongo:7.0', exposedPort: 27017 });
    const omnichannelApplication = buildModule<IntegrationTestApplication>(IntegrationTestApplication, envVars);
    const module = new IntegrationTestFactory(omnichannelApplication)
        .withContainer('mongodb', container)
        .mockExternalRemoteModuleDependency('TeamCollaborationExternalModuleConsumer', TeamCollaborationExternalModuleConsumer);
    let rpcClient: IInternalRPCClient;
    let roomId: string;

    beforeAll(async () => {
        await module.start();
        rpcClient = module.getRPCClient();
    });

    afterAll(() => module.stop());

    it('should return an empty array of omnichannel rooms when no room exists', async () => {
        const rooms = await rpcClient.send<void, any[]>('omnichannel', 'get-all-omnichannel-rooms', undefined);

        expect(rooms).toEqual([]);
        expect(rooms).toHaveLength(0);
    });

    it('should create a new omnichannel room', async () => {
        await rpcClient.send<CreateRoomInput, void>('omnichannel', 'create-omnichannel-room', {
            name: 'new-omni-room',
            exampleIds: ['id', 'id2'],
            example: 'string',
        });

        const rooms = await rpcClient.send<void, IOmnichannelRoomDomain[]>('omnichannel', 'get-all-omnichannel-rooms', undefined);
        expect(rooms).toHaveLength(1);

        const room = rooms.find((room) => room.name === 'new-omni-room');

        expect(room).not.toBeUndefined();
        expect(room!.name).toEqual('new-omni-room');
        roomId = room!._id;
    });

    it('should delete the created room', async () => {
        await rpcClient.send<string, void>('omnichannel', 'delete-omnichannel-room', roomId);

        const rooms = await rpcClient.send<void, IOmnichannelRoomDomain[]>('omnichannel', 'get-all-omnichannel-rooms', undefined);

        expect(rooms).toHaveLength(0);
    });

    it('should throw an error when trying to delete an inexistent room', async () => {
        try {
            await rpcClient.send<string, void>('omnichannel', 'delete-omnichannel-room', 'inexistent-room-id')
        } catch (e: any) {
            expect(e.message).toBe('Room not found');
        }
    });


});