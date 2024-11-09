import { injectable, MongoDBBaseRepository } from '@rocket.chat/fuel';
import type { DBIncludeFields, IDBBasicWriter } from '@rocket.chat/fuel/dist/internals';

import type { UserModel } from './schema/user';

export interface IUserRepository extends IDBBasicWriter {
	findOneByUsername(username: string, options?: DBIncludeFields): Promise<UserModel | null>;
}

@injectable()
export class UserRepository extends MongoDBBaseRepository<UserModel> implements IUserRepository {
	public async findOneByUsername(username: string, options?: DBIncludeFields): Promise<UserModel | null> {
		const user = await this.collection.findOne<UserModel>({ username }, { projection: options?.fields });
		if (!user) {
			return null;
		}

		return this.convertFromDB(user);
	}

	public fieldsMapping(): Record<string, string> {
		return {
			_updatedAt: 'updatedAt',
			lastLogin: 'lastLoginAt',
		};
	}

	public static collectionName(): string {
		return 'users';
	}
}
