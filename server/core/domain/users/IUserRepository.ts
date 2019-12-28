import { IRead, IWrite } from '../../shared';
import { IUser } from './User';

export interface IUserRepository extends IRead<IUser>, IWrite<IUser> {
	
}