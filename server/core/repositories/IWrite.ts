export interface IWriteOptions {
	multi?: boolean;
}

export interface IWrite<T> {
	update(filter: Record<string, any>, item: T | Record<string, any>, options?: IWriteOptions): Promise<any>;
	updateOneById(id: string, item: T | Record<string, any>, writeOptions?: IWriteOptions): Promise<boolean>;
	insert(item: T): Promise<any>;
}
