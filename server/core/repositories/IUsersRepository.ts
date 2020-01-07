import { IRead } from './IRead';
import { IWrite } from './IWrite';
import { IUser } from '../domain';

export interface IUsersRepository extends IRead<IUser>, IWrite<IUser> {
	findOneByIdOrUsername(idOrUsername: string): Promise<IUser | null>;
	setUserActiveById(_id: string, active: boolean): Promise<boolean>;
	unsetLoginTokensById(_id: string): Promise<boolean>;
	unsetReasonById(_id: string): Promise<boolean>;
}
