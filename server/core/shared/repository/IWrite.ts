export interface IWriteOptions {
	multi?: boolean;
}

export interface IWrite<T> {
	update(filter: Record<string, any>, item: T | Record<string, any>, writeOptions?: IWriteOptions): Promise<any>;
	insert(item: T): Promise<any>;
}
