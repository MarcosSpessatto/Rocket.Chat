export interface IReadOptions {
	skip?: number;
	limit?: number;
	sort?: any;
	fields?: any;
}

export interface IRead<T> {
	find(filter: Record<string, any>, options?: IReadOptions): Promise<T[]>;
	findOneById(id: string, options?: IReadOptions): Promise<T | null>;
	findOne(filter: Record<string, any>, options?: IReadOptions): Promise<T | null>;
}
