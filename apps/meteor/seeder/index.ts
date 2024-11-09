import { Seeder } from '@rocket.chat/fuel/dist/development';

import { RoomSeederBuilder } from './builders/room';

void (async () => {
	const databaseUrl = process.argv[2]?.split('=')[1];
	const databaseName = process.argv[3].split('=')[1];
	const dropDatabase = process.argv[4].split('=')[1] === 'true';
	const removeAllDocuments = process.argv[5].split('=')[1] === 'true';

	if (databaseUrl === undefined || databaseName === undefined || dropDatabase === undefined || removeAllDocuments === undefined) {
		throw new Error('Must provide all the parameters');
	}
	const rooms = RoomSeederBuilder.theRooms(10).map((builder) => builder.build());

	void new Seeder()
		.withDatabase({ databaseUrl, databaseName, dropDatabase, removeAllDocuments })
		.withCollection('rocketchat_room', rooms)
		.persist();
})();
