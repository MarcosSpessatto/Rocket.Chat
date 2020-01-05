export interface IMemoizationOptions {
	maxAge?: number;
}

export interface IMemoizationService {
	memoize(fn: Function, options?: IMemoizationOptions): Function;
	clear(fn: Function): void;
}
