import { Meteor } from 'meteor/meteor';

export interface IWebsocketMethodRegistration {
	registerMethod(name: string, handler: Function): Function;
}

export const websocketMethodRegistration = {
	registerMethod: (name: string, handler: Function): void => Meteor.methods({ [name]: handler as any }),
};
