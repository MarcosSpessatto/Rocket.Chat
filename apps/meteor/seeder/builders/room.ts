import { BaseDataBuilder } from '@rocket.chat/fuel/dist/testing/shared/data-builder';

import type { Owner } from '../../server/proposal/team-collaboration/domain/collaborators';
import { RoomModel } from '../../server/proposal/team-collaboration/infrastructure/database/mongodb/schema/room';
import { CollaboratorBuilder } from '../../tests/proposal/utils/team-collaboration/collaborator-builder';

export class RoomSeederBuilder extends BaseDataBuilder<RoomModel> {
	protected entity: RoomModel;

	private constructor() {
		super();
		this.entity = new RoomModel();
		this.withId();
		this.withName();
		this.withDisplayName();
		this.withType();
		this.withTopic();
		this.withOwner();
		this.withEncrypted();
		this.withMessagesCounter();
		this.withMembersCounter();
		this.entity.ts = new Date();
		this.entity._updatedAt = new Date();
	}

	public withId(id?: string): RoomSeederBuilder {
		this.entity._id = id || this.faker.database.mongodbObjectId();

		return this;
	}

	public withName(name?: string): RoomSeederBuilder {
		this.entity.name = name || `${this.faker.word.sample()}-${Math.random()}`;

		return this;
	}

	public withDisplayName(displayName?: string): RoomSeederBuilder {
		this.entity.fname = displayName || this.faker.word.sample();

		return this;
	}

	public withTopic(topic?: string): RoomSeederBuilder {
		this.entity.topic = topic || this.faker.word.sample();

		return this;
	}

	public withEncrypted(encrypted?: boolean): RoomSeederBuilder {
		this.entity.encrypted = encrypted || false;

		return this;
	}

	public withType(type?: string): RoomSeederBuilder {
		this.entity.t = (type || 'c') as any;

		return this;
	}

	public withMessagesCounter(counter?: number): RoomSeederBuilder {
		this.entity.msgs = counter || 0;

		return this;
	}

	public withMembersCounter(counter?: number): RoomSeederBuilder {
		this.entity.usersCount = counter || 0;

		return this;
	}

	public withOwner(owner?: Owner): RoomSeederBuilder {
		this.entity.u = owner || CollaboratorBuilder.aCollaborator().build();

		return this;
	}

	public withIsReadonly(isReadonly?: boolean): RoomSeederBuilder {
		this.entity.ro = isReadonly || false;

		return this;
	}

	public withIsBroadcast(isBroadcast?: boolean): RoomSeederBuilder {
		this.entity.broadcast = isBroadcast || false;

		return this;
	}

	public withTeamId(teamId?: string): RoomSeederBuilder {
		this.entity.teamId = teamId || this.faker.database.mongodbObjectId();

		return this;
	}

	public withTeamDefaultRoom(value?: boolean): RoomSeederBuilder {
		this.entity.teamDefault = value || false;

		return this;
	}

	public withTeamMainRoom(value?: boolean): RoomSeederBuilder {
		this.entity.teamMain = value || false;

		return this;
	}

	public withCustomFields(customFields?: Record<string, any>): RoomSeederBuilder {
		this.entity.customFields = customFields || { [this.faker.word.sample()]: this.faker.word.sample() };

		return this;
	}

	static theRooms(count: number): RoomSeederBuilder[] {
		return new Array(count).fill(undefined).map(() => {
			const roomSeederBuilder = RoomSeederBuilder.aRoom();
			roomSeederBuilder.withId();
			roomSeederBuilder.withName();
			roomSeederBuilder.withDisplayName();
			roomSeederBuilder.withType();
			roomSeederBuilder.withOwner();
			roomSeederBuilder.withMessagesCounter();
			roomSeederBuilder.withMembersCounter();
			roomSeederBuilder.withEncrypted();
			roomSeederBuilder.withTopic();

			return new RoomSeederBuilder();
		});
	}

	public static aRoom(): RoomSeederBuilder {
		return new RoomSeederBuilder();
	}
}
