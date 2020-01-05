import { IRead } from './IRead';
import { IWrite } from './IWrite';
import { ISubscription } from '../domain/Subscription';

export interface ISubscriptionsRepository extends IRead<ISubscription>, IWrite<ISubscription> {
	setArchivedByUsername(username: string, archived: boolean): Promise<any>;
}
