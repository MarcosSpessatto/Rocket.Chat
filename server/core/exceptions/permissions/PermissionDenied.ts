export class PermissionDenied extends Error {
	constructor() {
		super('Not allowed');
	}
}
