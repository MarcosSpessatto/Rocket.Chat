import { RocketChatFuel } from '@rocket.chat/fuel';

import { buildModule, validateAndReturnEnvFile } from './omnichannel.module';

(async (): Promise<void> => {
	await buildModule(RocketChatFuel, validateAndReturnEnvFile()).start();
})();

export * from './omnichannel.module';
