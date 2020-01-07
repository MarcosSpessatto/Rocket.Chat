export class SubscriptionNotFound extends Error {
	constructor(identifier: string) {
		super(`Subscription with identifier: ${ identifier } was not found.`);
	}
}
