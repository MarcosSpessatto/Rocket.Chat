import { inject, injectable } from '@rocket.chat/fuel';
import type { ReadOnlyCollection } from '@rocket.chat/fuel/dist/internals';
import {
	IDependencyContainerReader,
	IMongoDBReaderInteractor,
	InMemoryExternalModuleConsumer,
	MongoDBBaseReader,
} from '@rocket.chat/fuel/dist/internals';
import type { Collection } from 'mongodb';

import { IAMModuleProvider } from '../../../../iam/infrastructure/external-module-integration/provider';
import type { Collaborator } from '../../../domain/collaborators';

@injectable()
export class IAMReader extends MongoDBBaseReader {
	private collection: ReadOnlyCollection<Collection>;

	constructor(
		protected collectionName: string,
		protected dbAdapter: IMongoDBReaderInteractor,
		protected dependencyContainerReader: IDependencyContainerReader,
	) {
		super(collectionName, dbAdapter, dependencyContainerReader);
		this.collection = this.dbAdapter.collection(collectionName);
	}

	public async findUserById(_id: string): Promise<Record<string, any> | null> {
		return this.collection.findOne({ _id: _id as any }); // TODO: fix types
	}

	public async findUserByUsername(username: string): Promise<Record<string, any> | null> {
		return this.collection.findOne({ username: username as any }); // TODO: fix types
	}

	public static collectionName(): string {
		return 'users';
	}
}

@injectable()
export class IAMModuleConsumer extends InMemoryExternalModuleConsumer {
	constructor(@inject('IAMModuleProvider') private iamModuleProvider: IAMModuleProvider) {
		super(iamModuleProvider);
	}

	public async getUserById(id: string): Promise<Collaborator | null> {
		return this.iamModuleProvider.getUserById(id) as unknown as Collaborator; // TODO: fix type
	}

	public async getUserByUsername(username: string): Promise<Collaborator | null> {
		return this.iamModuleProvider.getUserByUsername(username) as unknown as Collaborator; // TODO: fix type
	}
}
