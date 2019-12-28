export interface IWriteOptions {
	multi?: boolean;
}

export interface IWrite<T> {
	update(filter: Object, item: T | Object, writeOptions?: IWriteOptions): Promise<any>;
	insert(item: T): Promise<any>;
}