import { BaseDataBuilder } from '@rocket.chat/fuel/dist/testing';

import type { Member, Owner } from '../../../../server/proposal/team-collaboration/domain/collaborators';
import { CollaboratorBuilder } from './collaborator-builder';

class Room {
	_id: string;

	name: string;

	displayName: string;

	members: Member[];

	owner: Owner;

	msgsCounter: number;

	type: string;

	membersCounter: number;

	isReadonly?: boolean;

	isBroadcast?: boolean;

	isCreatingOnBehalfOf?: boolean;

	teamId?: string;

	isTeamDefaultRoom?: boolean;

	isTeamMainRoom?: boolean;

	customFields?: Record<string, any>;
}

export class RoomBuilder extends BaseDataBuilder<Room> {
	protected entity: Room;

	private constructor() {
		super();
		this.entity = new Room();
		this.withId();
		this.withName();
		this.withDisplayName();
		this.withType();
		this.withMembers();
		this.withOwner();
		this.withMessagesCounter();
		this.withMembersCounter();
	}

	public withId(id?: string): RoomBuilder {
		this.entity._id = id || this.faker.database.mongodbObjectId();

		return this;
	}

	public withName(name?: string): RoomBuilder {
		this.entity.name = name || this.faker.word.sample();

		return this;
	}

	public withDisplayName(displayName?: string): RoomBuilder {
		this.entity.displayName = displayName || this.faker.word.sample();

		return this;
	}

	public withType(type?: string): RoomBuilder {
		this.entity.type = type || 'c';

		return this;
	}

	public withMessagesCounter(counter?: number): RoomBuilder {
		this.entity.msgsCounter = counter || 0;

		return this;
	}

	public withMembersCounter(counter?: number): RoomBuilder {
		this.entity.membersCounter = counter || 0;

		return this;
	}

	public withMembers(members?: Member[]): RoomBuilder {
		this.entity.members = members || [CollaboratorBuilder.aCollaborator().build()];

		return this;
	}

	public withOwner(owner?: Owner): RoomBuilder {
		this.entity.owner = owner || CollaboratorBuilder.aCollaborator().build();

		return this;
	}

	public withIsReadonly(isReadonly?: boolean): RoomBuilder {
		this.entity.isReadonly = isReadonly || false;

		return this;
	}

	public withIsBroadcast(isBroadcast?: boolean): RoomBuilder {
		this.entity.isBroadcast = isBroadcast || false;

		return this;
	}

	public withIsCreatingOnBehalfOf(isCreatingOnBehalfOf?: boolean): RoomBuilder {
		this.entity.isCreatingOnBehalfOf = isCreatingOnBehalfOf || false;

		return this;
	}

	public withTeamId(teamId?: string): RoomBuilder {
		this.entity.teamId = teamId || this.faker.database.mongodbObjectId();

		return this;
	}

	public withTeamDefaultRoom(value?: boolean): RoomBuilder {
		this.entity.isTeamDefaultRoom = value || false;

		return this;
	}

	public withTeamMainRoom(value?: boolean): RoomBuilder {
		this.entity.isTeamMainRoom = value || false;

		return this;
	}

	public withCustomFields(customFields?: Record<string, any>): RoomBuilder {
		this.entity.customFields = customFields || { [this.faker.word.sample()]: this.faker.word.sample() };

		return this;
	}

	static theRooms(count: number): RoomBuilder[] {
		return new Array(count).fill(undefined).map(() => {
			const roomBuilder = RoomBuilder.aRoom();
			roomBuilder.withId();
			roomBuilder.withName();
			roomBuilder.withDisplayName();
			roomBuilder.withMembers();
			roomBuilder.withOwner();

			return new RoomBuilder();
		});
	}

	public static aRoom(): RoomBuilder {
		return new RoomBuilder();
	}
}
