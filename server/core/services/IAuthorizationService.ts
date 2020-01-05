export interface IAuthorizationService {
	hasPermission(userId: string, permissions: string | string[], scope?: string): Promise<boolean>;
}
