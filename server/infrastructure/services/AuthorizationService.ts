import {
	IAuthorizationService,
	IPermissionsRepository,
	IMemoizationService,
	IUsersRepository,
	ISubscriptionsRepository,
	UserNotFound,
	SubscriptionNotFound,
} from '../../core';
import { Permissions, Roles } from '../../../app/models/server';

export class AuthorizationService implements IAuthorizationService {
	private getRolesMemoized: Function;

	private rolesHasPermissionMemoized: Function;

	constructor(
		private memoizationService: IMemoizationService,
		private permissionsRepository: IPermissionsRepository,
		private usersRepository: IUsersRepository,
		private subscriptionsRepository: ISubscriptionsRepository,
	) {
		this.getRolesMemoized = this.memoizationService.memoize(this.getRoles, { maxAge: 1000 });
		this.rolesHasPermissionMemoized = this.memoizationService.memoize(this.rolesHasPermission);
		this.observeAndInvalidateCache();
	}

	private observeAndInvalidateCache(): void {
		Permissions.on('change', () => {
			this.memoizationService.clear(this.getRolesMemoized);
			this.memoizationService.clear(this.rolesHasPermissionMemoized);
		});
		Roles.on('change', () => {
			this.memoizationService.clear(this.getRolesMemoized);
			this.memoizationService.clear(this.rolesHasPermissionMemoized);
		});
	}

	private async getRoles(userId: string, scope: string): Promise<string[]> {
		const user = await this.usersRepository.findOneById(userId);
		if (!user) {
			throw new UserNotFound(userId);
		}
		const { roles: userRoles = [] } = user;
		const roles = [...userRoles];
		if (!scope) {
			return roles.sort((a, b) => a.localeCompare(b));
		}
		const subscription = await this.subscriptionsRepository.findOne({ rid: scope, 'u._id': userId }, { fields: { roles: 1 } });
		if (!subscription) {
			throw new SubscriptionNotFound(scope);
		}
		roles.concat(subscription.roles);
		return roles.sort((a, b) => a.localeCompare(b));
	}

	private async rolesHasPermission(permission: string, roles: string[]): Promise<boolean> {
		const result = await this.permissionsRepository.findOne({ _id: permission, roles: { $in: roles } });
		return Boolean(result);
	}

	private async all(userId: string, permissions: string[], scope?: string): Promise<boolean> {
		const sortedRoles = await this.getRolesMemoized(userId, scope);
		for (const permission of permissions) {
			if (!await this.rolesHasPermissionMemoized(permission, sortedRoles)) { // eslint-disable-line
				return false;
			}
		}
		return true;
	}

	async hasPermission(userId: string, permissions: string | string[], scope?: string): Promise<boolean> {
		if (!userId) {
			return false;
		}
		const permissionsArray: string[] = [];
		return this.all(userId, permissionsArray.concat(permissions), scope);
	}
}
