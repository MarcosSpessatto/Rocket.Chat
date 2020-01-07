import s from 'underscore.string';

import { IStringHelper } from '../../core';

export class UnderscoreStringHelper implements IStringHelper {
	escapeHtml(sentence: string): string {
		return s.escapeHTML(sentence);
	}
}
