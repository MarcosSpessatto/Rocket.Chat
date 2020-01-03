import { IUser, IUserRepository, IReadOptions } from '../../../core';
import { MongoDbBaseRepository } from './shared/BaseRepository';

export class MongoDbUserRepository extends MongoDbBaseRepository<IUser> implements IUserRepository {
	findOneByIdOrUsername(idOrUsername: string, options?: IReadOptions): Promise<IUser | null> {
		return this.findOne({
			$or: [
				{ _id: idOrUsername },
				{ username: idOrUsername },
			],
		}, options);
	}
}
