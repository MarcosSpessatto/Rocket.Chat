export type CreateRoomParams = {
	type: string;
	name: string;
	ownerId: string;
	membersUsername: string[];
	isCreatingOnBehalfOf?: boolean;
	isReadonly?: boolean;
	isTeamMainRoom?: boolean;
	isTeamDefaultRoom?: boolean;
	teamId?: string;
	parentRoomId?: string;
	displayName?: string;
};

export type SettingsFromCore = {
	shouldAllowSpecialCharactersOnName: boolean;
	systemBlockedIdentifiers: string[];
	usernameBlockedIdentifiers: string[];
	validationPattern: string;
};
