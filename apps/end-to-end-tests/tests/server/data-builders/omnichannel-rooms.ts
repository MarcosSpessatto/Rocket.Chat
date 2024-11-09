import { BaseDataBuilder } from '@rocket.chat/fuel/dist/testing';

class OmnichannelRoom {
	name: string;

	exampleIds: string[];

	example?: string;

	when?: Date;
}

export class OmnichannelRoomBuilder extends BaseDataBuilder<OmnichannelRoom> {
	protected entity: OmnichannelRoom;

	private constructor() {
		super();
		this.entity = new OmnichannelRoom();
		this.withName();
		this.withExampleIds();
	}

	public withName(name?: string): OmnichannelRoomBuilder {
		this.entity.name = name || this.faker.word.sample();

		return this;
	}

	public withExampleIds(exampleIds?: string[]): OmnichannelRoomBuilder {
		this.entity.exampleIds = exampleIds || [this.faker.database.mongodbObjectId()];

		return this;
	}

	static theRooms(count: number): OmnichannelRoomBuilder[] {
		return new Array(count).fill(undefined).map(() => {
			const roomBuilder = OmnichannelRoomBuilder.aRoom();
			roomBuilder.withName();
			roomBuilder.withExampleIds();

			return new OmnichannelRoomBuilder();
		});
	}

	public static aRoom(): OmnichannelRoomBuilder {
		return new OmnichannelRoomBuilder();
	}
}
