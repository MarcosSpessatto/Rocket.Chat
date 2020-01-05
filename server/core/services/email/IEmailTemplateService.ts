export interface IEmailTemplateService<T> {
	subject(item: T): Promise<string>;
	html(item: T, url?: string): Promise<string>;
}
