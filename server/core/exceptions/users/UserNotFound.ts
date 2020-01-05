export class UserNotFound extends Error {
	constructor(identifier: string) {
		super(`User with identifier: ${ identifier } was not found.`);
	}
}
