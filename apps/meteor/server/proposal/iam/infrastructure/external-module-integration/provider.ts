import { FUEL_DI_TOKENS, IDBConnectionReaderFactory, inject, injectable, InMemoryExternalModuleProvider } from '@rocket.chat/fuel';
import type { IDBBasicReader } from '@rocket.chat/fuel/dist/internals';

import type { IUserDomain } from '../../domain/user.definition';
import { UserModel } from '../database/schema/user';
import { IUserRepository } from '../database/user';

export interface IUserDTO {
	_id: string;
	username?: string;
	name?: string;
	settings?: {
		profile: any;
		preferences?: {
			[key: string]: any;
		};
	};
}

@injectable()
export class IAMModuleProvider extends InMemoryExternalModuleProvider {
	private userBasicReader: IDBBasicReader;

	constructor(
		@inject(FUEL_DI_TOKENS.DB_CONNECTION_READER_FACTORY) private dbReaderFactory: IDBConnectionReaderFactory,
		@inject('UserRepository') private userRepository: IUserRepository,
	) {
		super();
		this.userBasicReader = this.dbReaderFactory.createBasicReaderForEntity(UserModel);
	}

	public async getUserById(id: string): Promise<IUserDTO | null> {
		const user = await this.userBasicReader.findOneById<IUserDomain>(id);
		if (!user) {
			return null;
		}

		return {
			_id: user._id,
			username: user.username,
			name: user.name,
			settings: user.settings,
		};
	}

	public async getUserByUsername(username: string): Promise<IUserDTO | null> {
		return this.userRepository.findOneByUsername(username, { fields: { _id: true, username: true, name: true, settings: true } });
	}
}
