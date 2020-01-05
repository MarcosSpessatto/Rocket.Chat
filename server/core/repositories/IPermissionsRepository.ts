import { IRead } from './IRead';
import { IWrite } from './IWrite';
import { IPermission } from '../domain/Permission';

export interface IPermissionsRepository extends IRead<IPermission>, IWrite<IPermission> {
}
