export interface IReadOptions {
	offset: number;
	limit: number;
	sort: any;
	fields: any;
};

export interface IRead<T> {
	find(filter: Object, options?: IReadOptions): Promise<T[]>;
	findOneById(id: string, options?: IReadOptions): Promise<T | null>;
	findOne(filter: Object, options?: IReadOptions): Promise<T | null>;
}