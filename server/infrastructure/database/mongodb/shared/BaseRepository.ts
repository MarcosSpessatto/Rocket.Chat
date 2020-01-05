import { Collection } from 'mongodb';

import { IRead, IReadOptions, IWrite, IWriteOptions } from '../../../../core';

export abstract class MongoDbBaseRepository<T> implements IRead<T>, IWrite<T> {
	protected collection: Collection

	constructor(collection: Collection) {
		this.collection = collection;
	}

	find(filter: Record<string, any>, options?: IReadOptions): Promise<T[]> {
		return this.collection.find(filter, options).toArray();
	}

	findOneById(_id: string, options?: IReadOptions): Promise<T | null> {
		return this.collection.findOne({ _id }, options);
	}

	findOne(filter: Record<string, any>, options?: IReadOptions): Promise<T | null> {
		return this.collection.findOne(filter, options);
	}

	update(filter: Record<string, any>, item: T | Record<string, any>, options?: IWriteOptions): Promise<any> {
		return this.collection.update(filter, item, options);
	}

	async updateOneById(_id: string, item: T | Record<string, any>): Promise<boolean> {
		return (await this.collection.updateOne({ _id }, item)).result.ok === 1;
	}

	insert(item: T): Promise<any> {
		return this.collection.insert(item);
	}
}
