import { BaseDataBuilder } from '@rocket.chat/fuel/dist/testing';

class Collaborator {
	_id: string;

	name: string;

	username: string;
}

export class CollaboratorBuilder extends BaseDataBuilder<Collaborator> {
	protected entity: Collaborator;

	private constructor() {
		super();
		this.entity = new Collaborator();
		this.withId();
		this.withUsername();
		this.withName();
	}

	public withId(id?: string): CollaboratorBuilder {
		this.entity._id = id || this.faker.database.mongodbObjectId();

		return this;
	}

	public withName(name?: string): CollaboratorBuilder {
		this.entity.name = name || this.faker.person.fullName();

		return this;
	}

	public withUsername(username?: string): CollaboratorBuilder {
		this.entity.username = username || this.faker.internet.userName();

		return this;
	}

	static theCollaborators(count: number): CollaboratorBuilder[] {
		return new Array(count).fill(undefined).map(() => {
			const collaboratorBuilder = CollaboratorBuilder.aCollaborator();
			collaboratorBuilder.withId();
			collaboratorBuilder.withName();
			collaboratorBuilder.withUsername();

			return new CollaboratorBuilder();
		});
	}

	public static aCollaborator(): CollaboratorBuilder {
		return new CollaboratorBuilder();
	}
}
