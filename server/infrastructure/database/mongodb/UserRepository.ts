import { IUser, IUserRepository } from '../../../core';
import { MongoDbBaseRepository } from './shared/BaseRepository';

export class MongodbUserRepository extends MongoDbBaseRepository<IUser> implements IUserRepository {

}