import { ISubscription, ISubscriptionsRepository } from '../../../core';
import { MongoDbBaseRepository } from './shared/BaseRepository';

export class MongoDbSubscriptionsRepository extends MongoDbBaseRepository<ISubscription> implements ISubscriptionsRepository {
	setArchivedByUsername(username: string, archived: boolean): Promise<any> {
		const query = {
			t: 'd',
			name: username,
		};

		const update = {
			$set: {
				archived,
			},
		};

		return this.update(query, update, { multi: true });
	}
}
