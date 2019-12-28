import { IUserRepository } from './../IUserRepository';
import { IUser } from '../User';
import { IUseCase } from './../../../shared';

class Output {
	presence: string;
	lastLogin?: Date;
	connectionStatus?: string;

	constructor(user: IUser) {
		this.presence = user.status ?? 'offline';
		this.lastLogin = user.lastLogin;
		this.connectionStatus = user.statusConnection
	}
}

export class GetUserStatus implements IUseCase<string, Promise<Output>> {

	constructor(private userRepository: IUserRepository) {
	}

	async handle(userId: string): Promise<Output> {
		return new Output(await this.userRepository.findOne({ _id: userId }) as IUser);
	}

}