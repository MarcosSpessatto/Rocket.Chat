import { UserNotFound } from '../../exceptions/users/UserNotFound';
import { GetUserPresence } from './GetUserPresence';
import { usersRepositoryMock } from '../../../../tests/utils/stubs';

describe('GetUserPresence - UseCase', () => {
	let getUserPresence: GetUserPresence;

	beforeAll(() => {
		getUserPresence = new GetUserPresence(usersRepositoryMock);
	});

	afterEach(() => {
		usersRepositoryMock.findOneByIdOrUsername.mockClear();
	});

	describe('#execute()', () => {
		it('should return an UserNotFound exception when the user was not found', async () => {
			usersRepositoryMock.findOneByIdOrUsername.mockReturnValueOnce(undefined);
			await expect(getUserPresence.execute('test')).rejects.toThrowError(new UserNotFound('test'));
		});

		it('should return a response with "presence" property only and it to be equal status when the status is defined', async () => {
			const output = { presence: 'online' };
			usersRepositoryMock.findOneByIdOrUsername.mockReturnValueOnce({ status: 'online' });
			expect(await getUserPresence.execute('test')).toEqual(output);
		});

		it('should return a response with "presence" property only and it to be equal "offline" when the user has no status defined', async () => {
			const output = { presence: 'offline' };
			usersRepositoryMock.findOneByIdOrUsername.mockReturnValueOnce({ });
			expect(await getUserPresence.execute('test')).toEqual(output);
		});

		it('should return a response with all presence properties', async () => {
			const lastLogin = new Date();
			const output = { presence: 'offline', lastLogin, connectionStatus: 'available' };
			usersRepositoryMock.findOneByIdOrUsername.mockReturnValueOnce({ status: 'offline', lastLogin, statusConnection: 'available' });
			expect(await getUserPresence.execute('test')).toEqual(output);
		});
	});
});
