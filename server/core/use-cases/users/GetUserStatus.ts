import { IUser, IUserRepository } from '../../domain';
import { IUseCase } from '../../shared';
import { UserNotFound } from './exceptions/UserNotFound';

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

export class GetUserStatus implements IUseCase<string, Promise<Output>> {
	private userRepository: IUserRepository;

	constructor(userRepository: IUserRepository) {
		this.userRepository = userRepository;
	}

	async execute(idOrUsername: string): Promise<Output> {
		const user = await this.userRepository.findOneByIdOrUsername(idOrUsername) as IUser;
		if (!user) {
			throw new UserNotFound(idOrUsername);
		}
		return new Output(user);
	}
}
