import { IRead, IReadOptions, IWrite, IWriteOptions } from '../../../../core';
import { Collection } from 'mongodb';

export abstract class MongoDbBaseRepository<T> implements IRead<T>, IWrite<T> {

	constructor(private collection: Collection) {
	}

	find(filter: Object, options?: IReadOptions): Promise<T[]> {
		return this.collection.find(filter, options).toArray();
	}

	findOneById(_id: string, options?: IReadOptions): Promise<T| null> {
		return this.collection.findOne({ _id }, options);
	}

	findOne(filter: Object, options?: IReadOptions): Promise<T | null> {
		return this.collection.findOne(filter, options);
	}

	update(filter: Object, item: T | Object, options?: IWriteOptions): Promise<any> {
		return this.collection.update(filter, item, options);
	}

	insert(item: T): Promise<any> {
		return this.collection.insert(item);
	}

}