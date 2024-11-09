import { Random } from '@rocket.chat/random';
import { createRoom } from "./room";

jest.mock('@rocket.chat/random', () => ({
    Random: { id: jest.fn() },
}));

describe('[Domain] - Room', () => {
    describe('#createRoom()', () => {

        beforeEach(() => {
            (Random.id as jest.Mock).mockReturnValue('1')
        });

        afterEach(() => jest.resetAllMocks());

        it('should create a new Omnichannel room with "example" value as displayName when provided', () => {
            expect(createRoom({ exampleIds: [], name: 'name', example: 'example' })).toEqual({
                _id: '1',
                membersCounter: 1,
                msgsCounter: 0,
                type: 'l',
                name: 'name',
                owner: {
                },
                displayName: 'example',
                membersIds: [],
                createdAt: undefined,
            })
        });
        it('should create a new Omnichannel room with an empty string as displayName when "example" was not provided', () => {
            expect(createRoom({ exampleIds: [], name: 'name' })).toEqual({
                _id: '1',
                membersCounter: 1,
                msgsCounter: 0,
                type: 'l',
                name: 'name',
                owner: {
                },
                displayName: '',
                membersIds: [],
                createdAt: undefined,
            })
        });
    });
});