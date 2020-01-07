import { IPermission, IPermissionsRepository } from '../../../core';
import { MongoDbBaseRepository } from './shared/BaseRepository';

export class MongoDbPermissionsRepository extends MongoDbBaseRepository<IPermission> implements IPermissionsRepository {

}
