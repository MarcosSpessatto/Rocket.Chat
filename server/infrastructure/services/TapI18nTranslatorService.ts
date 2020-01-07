import { TAPi18n } from 'meteor/rocketchat:tap-i18n';

import { ITranslatorService } from '../../core';

export class TapI18nTranslatorService implements ITranslatorService {
	translate(sentence: string): string {
		return TAPi18n.__(sentence);
	}
}
