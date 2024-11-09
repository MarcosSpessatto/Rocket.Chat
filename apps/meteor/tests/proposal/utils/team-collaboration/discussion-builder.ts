import { BaseDataBuilder } from '@rocket.chat/fuel/dist/testing';

import type { Member, Owner } from '../../../../server/proposal/team-collaboration/domain/collaborators';
import { CollaboratorBuilder } from './collaborator-builder';

class DiscussionRoom {
	name: string;

	displayName: string;

	members: Member[];

	owner: Owner;

	parentRoomId: string;

	isReadonly?: boolean;

	isBroadcast?: boolean;

	isCreatingOnBehalfOf?: boolean;

	teamId?: string;
}

export class DiscussionRoomBuilder extends BaseDataBuilder<DiscussionRoom> {
	protected entity: DiscussionRoom;

	private constructor() {
		super();
		this.entity = new DiscussionRoom();
		this.withName();
		this.withDisplayName();
		this.withMembers();
		this.withOwner();
		this.withParentId();
	}

	public withName(name?: string): DiscussionRoomBuilder {
		this.entity.name = name || this.faker.word.sample();

		return this;
	}

	public withDisplayName(displayName?: string): DiscussionRoomBuilder {
		this.entity.displayName = displayName || this.faker.word.sample();

		return this;
	}

	public withMembers(members?: Member[]): DiscussionRoomBuilder {
		this.entity.members = members || [CollaboratorBuilder.aCollaborator().build()];

		return this;
	}

	public withOwner(owner?: Owner): DiscussionRoomBuilder {
		this.entity.owner = owner || CollaboratorBuilder.aCollaborator().build();

		return this;
	}

	public withIsReadonly(isReadonly?: boolean): DiscussionRoomBuilder {
		this.entity.isReadonly = isReadonly || false;

		return this;
	}

	public withIsBroadcast(isBroadcast?: boolean): DiscussionRoomBuilder {
		this.entity.isBroadcast = isBroadcast || false;

		return this;
	}

	public withIsCreatingOnBehalfOf(isCreatingOnBehalfOf?: boolean): DiscussionRoomBuilder {
		this.entity.isCreatingOnBehalfOf = isCreatingOnBehalfOf || false;

		return this;
	}

	public withParentId(parentRoomId?: string): DiscussionRoomBuilder {
		this.entity.parentRoomId = parentRoomId || this.faker.database.mongodbObjectId();

		return this;
	}

	public withTeamId(teamId?: string): DiscussionRoomBuilder {
		this.entity.teamId = teamId || this.faker.database.mongodbObjectId();

		return this;
	}

	static theDiscussions(count: number): DiscussionRoomBuilder[] {
		return new Array(count).fill(undefined).map(() => {
			const roomBuilder = DiscussionRoomBuilder.aDiscussion();
			roomBuilder.withName();
			roomBuilder.withDisplayName();
			roomBuilder.withMembers();
			roomBuilder.withOwner();

			return new DiscussionRoomBuilder();
		});
	}

	public static aDiscussion(): DiscussionRoomBuilder {
		return new DiscussionRoomBuilder();
	}
}
