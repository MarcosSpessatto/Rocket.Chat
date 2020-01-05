export interface IPermission {
	_id: string;
	_updatedAt: Date;
	roles: string[];
}

export enum PermissionsEnum {
	EDIT_OTHER_USER_ACTIVE_STATUS = 'edit-other-user-active-status',
}
