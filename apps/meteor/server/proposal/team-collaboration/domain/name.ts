import { escapeRegExp } from '@rocket.chat/string-helpers';
import limax from 'limax';

const DEFAULT_REGEX_VALIDATION = new RegExp('^[0-9a-zA-Z-_.]+$');
const DEFAULT_WORKSPACE_USERNAME_MENTIONS = ['all', 'here'];

export type NameValidationOptions = {
	systemBlockedIdentifiers: string[];
	usernameBlockedIdentifiers: string[];
	validationPattern: string;
};

const isASystemBlockedIdentifier = (name: string, blockedIdentifiers: string[]): boolean =>
	blockedIdentifiers.length !== 0 && blockedIdentifiers.includes(name.toLowerCase());

const isABlockedName = (name: string, usernameBlockedIdentifiers: string[]): boolean => {
	const usernameDisallowList = DEFAULT_WORKSPACE_USERNAME_MENTIONS.map(
		(value) => new RegExp(`^${escapeRegExp(value).trim()}$`, 'i'),
	).concat(usernameBlockedIdentifiers.map((value) => new RegExp(`^${escapeRegExp(value).trim()}$`, 'i')));

	return Boolean(
		usernameDisallowList.length && usernameDisallowList.some((restrictedUsername) => restrictedUsername.test(escapeRegExp(name).trim())),
	);
};

export const slugifyName = (name: string): string => limax(name, { maintainCase: true });

export const validateRoomName = ({ name, options }: { name: string; options: NameValidationOptions }): void => {
	if (name.trim().length === 0) {
		throw new Error('Invalid Room Name');
	}

	let nameValidation = DEFAULT_REGEX_VALIDATION;
	if (options.validationPattern) {
		try {
			nameValidation = new RegExp(`^${options.validationPattern}$`);
		} catch (error) {
			// noop
		}
	}

	if (
		!nameValidation.test(name) ||
		isASystemBlockedIdentifier(name, options.systemBlockedIdentifiers || []) ||
		isABlockedName(name, options.usernameBlockedIdentifiers || [])
	) {
		throw new Error('Invalid Room Name');
	}
};
