import { validateRoomName } from './name';

const date = new Date();

jest.useFakeTimers().setSystemTime(date);

jest.mock('@rocket.chat/random', () => ({
	Random: {
		id: jest.fn().mockReturnValue('generated-id'),
	},
}));
jest.mock('limax', () => {
	() => jest.fn().mockReturnValue('sanitized');
});

describe('Team Collaboration - Domain', () => {
	afterEach(() => jest.restoreAllMocks());

	describe('Name', () => {
		describe('#validateRoomName()', () => {
			it('should throw an error if empty string', () => {
				expect(() => validateRoomName({ name: '', options: {} as any })).toThrow(new Error('Invalid Room Name'));
			});

			it('should throw an error if the name does not match with the default regex validation', () => {
				expect(() => validateRoomName({ name: '!@#$%¨&*', options: {} as any })).toThrow(new Error('Invalid Room Name'));
			});

			it('should throw an error if the name does not match with the provided regex validation', () => {
				expect(() => validateRoomName({ name: '!@#$%¨&*', options: { validationPattern: '^[0-9a-zA-Z-_.]+$' } as any })).toThrow(
					new Error('Invalid Room Name'),
				);
			});

			it('should throw an error if the name is a system blocked identifier', () => {
				expect(() => validateRoomName({ name: 'admin', options: { systemBlockedIdentifiers: ['admin'] } as any })).toThrow(
					new Error('Invalid Room Name'),
				);
			});

			it('should throw an error if the name is a blocked name', () => {
				expect(() => validateRoomName({ name: 'blocked', options: { usernameBlockedIdentifiers: ['blocked'] } as any })).toThrow(
					new Error('Invalid Room Name'),
				);
			});

			it('should throw an error if the name includes "all" ', () => {
				expect(() => validateRoomName({ name: 'all', options: { usernameBlockedIdentifiers: ['blocked'] } as any })).toThrow(
					new Error('Invalid Room Name'),
				);
			});

			it('should throw an error if the name includes "here"', () => {
				expect(() => validateRoomName({ name: 'here', options: { usernameBlockedIdentifiers: ['blocked'] } as any })).toThrow(
					new Error('Invalid Room Name'),
				);
			});

			it('should NOT throw if its a valid room name', () => {
				expect(() =>
					validateRoomName({
						name: 'valid-room-name',
						options: { systemBlockedIdentifiers: ['admin'], usernameBlockedIdentifiers: ['blocked'] } as any,
					}),
				).not.toThrow();
			});
		});
	});
});
