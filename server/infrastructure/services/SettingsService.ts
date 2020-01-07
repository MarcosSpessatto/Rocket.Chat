import { ISettingsService } from '../../core';
import { getValue } from '../../../app/settings/server/raw';

export class SettingsService implements ISettingsService {
	getValue(_id: string): Promise<any> {
		return getValue(_id);
	}
}
