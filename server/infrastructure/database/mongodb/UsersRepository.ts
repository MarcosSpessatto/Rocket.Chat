import { IUser, IUsersRepository, IReadOptions } from '../../../core';
import { MongoDbBaseRepository } from './shared/BaseRepository';

export class MongoDbUsersRepository extends MongoDbBaseRepository<IUser> implements IUsersRepository {
	findOneByIdOrUsername(idOrUsername: string, options?: IReadOptions): Promise<IUser | null> {
		return this.findOne({
			$or: [
				{ _id: idOrUsername },
				{ username: idOrUsername },
			],
		}, options);
	}

	setUserActiveById(_id: string, active: boolean): Promise<boolean> {
		const update = {
			$set: {
				active,
			},
		};

		return this.updateOneById(_id, update);
	}

	unsetLoginTokensById(_id: string): Promise<boolean> {
		const update = {
			$set: {
				'services.resume.loginTokens': [],
			},
		};

		return this.updateOneById(_id, update);
	}

	unsetReasonById(_id: string): Promise<boolean> {
		const update = {
			$unset: {
				reason: true,
			},
		};

		return this.updateOneById(_id, update);
	}
}
