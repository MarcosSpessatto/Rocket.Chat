import { IUsersRepository } from '../../repositories/IUsersRepository';
import { IUseCase } from '../IUseCase';
import { IUser } from '../../domain';
import { UserNotFound } from '../../exceptions';

class Output {
	presence: string;

	lastLogin?: Date;

	connectionStatus?: string;

	constructor(user: IUser) {
		this.presence = user.status ?? 'offline';
		this.lastLogin = user.lastLogin;
		this.connectionStatus = user.statusConnection;
	}
}

export class GetUserPresence implements IUseCase<string, Promise<Output>> {
	constructor(private usersRepository: IUsersRepository) {
	}

	async execute(idOrUsername: string): Promise<Output> {
		const user = await this.usersRepository.findOneByIdOrUsername(idOrUsername) as IUser;
		if (!user) {
			throw new UserNotFound(idOrUsername);
		}
		return new Output(user);
	}
}
