import mem from 'mem';

import { IMemoizationService, IMemoizationOptions } from '../../core';

export class MemoizationService implements IMemoizationService {
	memoize(fn: Function, options?: IMemoizationOptions): Function {
		return mem(fn, options);
	}

	clear(fn: Function): void {
		mem.clear(fn);
	}
}
