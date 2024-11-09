import { FUEL_DI_TOKENS, DomainEventPublisher, IDBConnectionReaderFactory, inject, injectable } from '@rocket.chat/fuel';
import type { IDBBasicReader } from '@rocket.chat/fuel/dist/internals';

import type { IUserDTO } from '../../../iam/infrastructure/external-module-integration/provider';
import type { Member, Owner } from '../../domain/collaborators';
import {
	createPublicDiscussionAndMembership,
	createPrivateDiscussionAndMembership,
	createPublicDiscussionAndMembershipInsideTeam,
	createPrivateDiscussionAndMembershipInsideTeam,
} from '../../domain/discussion';
import { PublicRoomCreated } from '../../domain/events/room-created';
import { createPrivateRoomAndMemberships, createPublicRoomAndMemberships } from '../../domain/room';
import { createPublicRoomInsideATeam } from '../../domain/team';
import { IRoomRepository } from '../../infrastructure/database/mongodb/room';
import { TeamModel } from '../../infrastructure/database/mongodb/schema/team';
import { ISubscriptionRepository } from '../../infrastructure/database/mongodb/subscription';
import { IAMModuleConsumer } from '../../infrastructure/external-module-integration/consumer/iam';
import type { CreateRoomParams, SettingsFromCore } from '../../shared/input/room-input';

@injectable()
export class RoomService {
	private teamBasicReader: IDBBasicReader;

	constructor(
		@inject('RoomRepository') private roomRepository: IRoomRepository,
		@inject('SubscriptionRepository') private subscriptionRepository: ISubscriptionRepository,
		@inject('IAMModuleConsumer') private iamConsumer: IAMModuleConsumer,
		@inject(FUEL_DI_TOKENS.DOMAIN_EVENT_PUBLISHER) private domainEventPublisher: DomainEventPublisher,
		@inject(FUEL_DI_TOKENS.DB_CONNECTION_READER_FACTORY) private dbReaderFactory: IDBConnectionReaderFactory,
	) {
		this.teamBasicReader = this.dbReaderFactory.createBasicReaderForEntity(TeamModel);
	}

	// TODO: remove setting as soon as we have a settings module available under the DI container
	public async createPublicRoomAndMembership(
		{ name, ownerId, membersUsername, isReadonly, isCreatingOnBehalfOf, settings }: CreateRoomParams & { settings: SettingsFromCore },
		roomExtraData?: Record<string, any>,
		subscriptionExtraData?: Record<string, any>,
	): Promise<string> {
		const [owner, members] = await Promise.all([this.validateAndReturnOwner(ownerId), this.validateAndReturnMembers(membersUsername)]);
		// const shouldAllowSpecialCharactersOnName = this.settings.get('UI_Allow_room_names_with_special_chars');
		// const systemBlockedIdentifiers = this.settings.get('Accounts_SystemBlockedUsernameList');
		// const usernameBlockedIdentifiers = this.settings.get('Accounts_BlockedUsernameList');
		// const validationPatternForRoomName = this.settings.get('UTF8_Channel_Names_Validation');
		const { shouldAllowSpecialCharactersOnName } = settings;
		const { systemBlockedIdentifiers } = settings;
		const { usernameBlockedIdentifiers } = settings;
		const validationPatternForRoomName = settings.validationPattern;

		const newRoom = createPublicRoomAndMemberships({
			owner: owner as Owner,
			isReadonly,
			name: {
				value: name,
				options: {
					shouldAllowSpecialCharactersOnName,
					systemBlockedIdentifiers,
					usernameBlockedIdentifiers,
					validationPattern: validationPatternForRoomName,
				},
			},
			isCreatingOnBehalfOf,
			members,
		});
		await this.checkIfNameAlreadyExists(newRoom.room.name);

		if (!newRoom) {
			throw new Error('Could not create a room');
		}
		await this.roomRepository.insertOneWithExtraData(newRoom.room, roomExtraData);
		await this.subscriptionRepository.insertManyWithExtraData(newRoom.memberships, subscriptionExtraData);
		this.domainEventPublisher.dispatch(
			new PublicRoomCreated({ _id: newRoom.room._id, name: newRoom.room.name, owner: newRoom.room.owner }),
		);

		return newRoom.room._id; // TODO: this should not be returned, kept it here for compatibility
	}

	public async createPrivateRoomAndMembership(
		{ name, ownerId, membersUsername, isReadonly, isCreatingOnBehalfOf, settings }: CreateRoomParams & { settings: SettingsFromCore },
		roomExtraData?: Record<string, any>,
		subscriptionExtraData?: Record<string, any>,
	): Promise<string> {
		const [owner, members] = await Promise.all([this.validateAndReturnOwner(ownerId), this.validateAndReturnMembers(membersUsername)]);
		// const shouldAllowSpecialCharactersOnName = this.settings.get('UI_Allow_room_names_with_special_chars');
		// const systemBlockedIdentifiers = this.settings.get('Accounts_SystemBlockedUsernameList');
		// const usernameBlockedIdentifiers = this.settings.get('Accounts_BlockedUsernameList');
		// const validationPatternForRoomName = this.settings.get('UTF8_Channel_Names_Validation');
		const { shouldAllowSpecialCharactersOnName } = settings;
		const { systemBlockedIdentifiers } = settings;
		const { usernameBlockedIdentifiers } = settings;
		const validationPatternForRoomName = settings.validationPattern;

		const newRoom = createPrivateRoomAndMemberships({
			owner: owner as Owner,
			isReadonly,
			name: {
				value: name,
				options: {
					shouldAllowSpecialCharactersOnName,
					systemBlockedIdentifiers,
					usernameBlockedIdentifiers,
					validationPattern: validationPatternForRoomName,
				},
			},
			isCreatingOnBehalfOf,
			members,
		});
		await this.checkIfNameAlreadyExists(newRoom.room.name);

		if (!newRoom) {
			throw new Error('Could not create a room');
		}
		await this.roomRepository.insertOneWithExtraData(newRoom.room, roomExtraData);
		await this.subscriptionRepository.insertManyWithExtraData(newRoom.memberships, subscriptionExtraData);

		return newRoom.room._id; // TODO: this should not be returned, kept it here for compatibility
	}

	public async createPublicRoomAndMembershipInsideTeam(
		{
			name,
			ownerId,
			membersUsername,
			isReadonly,
			isCreatingOnBehalfOf,
			teamId,
			isTeamDefaultRoom,
			isTeamMainRoom,
			settings,
		}: CreateRoomParams & { settings: SettingsFromCore },
		roomExtraData?: Record<string, any>,
		subscriptionExtraData?: Record<string, any>,
	): Promise<string> {
		if (!teamId) {
			throw new Error('Cannot create a room inside a team without the teamId');
		}
		if (!(await this.teamBasicReader.findOneById(teamId))) {
			throw new Error('Could not find the provided team');
		}
		const [owner, members] = await Promise.all([this.validateAndReturnOwner(ownerId), this.validateAndReturnMembers(membersUsername)]);
		// const shouldAllowSpecialCharactersOnName = this.settings.get('UI_Allow_room_names_with_special_chars');
		// const systemBlockedIdentifiers = this.settings.get('Accounts_SystemBlockedUsernameList');
		// const usernameBlockedIdentifiers = this.settings.get('Accounts_BlockedUsernameList');
		// const validationPatternForRoomName = this.settings.get('UTF8_Channel_Names_Validation');
		const { shouldAllowSpecialCharactersOnName } = settings;
		const { systemBlockedIdentifiers } = settings;
		const { usernameBlockedIdentifiers } = settings;
		const validationPatternForRoomName = settings.validationPattern;

		const newRoom = createPublicRoomInsideATeam({
			owner: owner as Owner,
			isReadonly,
			name: {
				value: name,
				options: {
					shouldAllowSpecialCharactersOnName,
					systemBlockedIdentifiers,
					usernameBlockedIdentifiers,
					validationPattern: validationPatternForRoomName,
				},
			},
			isCreatingOnBehalfOf,
			members,
			teamId,
			isTeamDefaultRoom: isTeamDefaultRoom || false,
			isTeamMainRoom: isTeamMainRoom || false,
		});
		await this.checkIfNameAlreadyExists(newRoom.room.name);

		if (!newRoom) {
			throw new Error('Could not create a room');
		}
		await this.roomRepository.insertOneWithExtraData(newRoom.room, roomExtraData);
		await this.subscriptionRepository.insertManyWithExtraData(newRoom.memberships, subscriptionExtraData);
		this.domainEventPublisher.dispatch(
			new PublicRoomCreated({ _id: newRoom.room._id, name: newRoom.room.name, owner: newRoom.room.owner }),
		);

		return newRoom.room._id; // TODO: this should not be returned, kept it here for compatibility
	}

	public async createPrivateRoomAndMembershipInsideTeam(
		{
			name,
			ownerId,
			membersUsername,
			isReadonly,
			isCreatingOnBehalfOf,
			teamId,
			isTeamDefaultRoom,
			isTeamMainRoom,
			settings,
		}: CreateRoomParams & { settings: SettingsFromCore },
		roomExtraData?: Record<string, any>,
		subscriptionExtraData?: Record<string, any>,
	): Promise<string> {
		if (!teamId) {
			throw new Error('Cannot create a room inside a team without the teamId');
		}
		if (!(await this.teamBasicReader.findOneById(teamId))) {
			throw new Error('Could not find the provided team');
		}
		const [owner, members] = await Promise.all([this.validateAndReturnOwner(ownerId), this.validateAndReturnMembers(membersUsername)]);
		// const shouldAllowSpecialCharactersOnName = this.settings.get('UI_Allow_room_names_with_special_chars');
		// const systemBlockedIdentifiers = this.settings.get('Accounts_SystemBlockedUsernameList');
		// const usernameBlockedIdentifiers = this.settings.get('Accounts_BlockedUsernameList');
		// const validationPatternForRoomName = this.settings.get('UTF8_Channel_Names_Validation');
		const { shouldAllowSpecialCharactersOnName } = settings;
		const { systemBlockedIdentifiers } = settings;
		const { usernameBlockedIdentifiers } = settings;
		const validationPatternForRoomName = settings.validationPattern;

		const newRoom = createPublicRoomInsideATeam({
			owner: owner as Owner,
			isReadonly,
			name: {
				value: name,
				options: {
					shouldAllowSpecialCharactersOnName,
					systemBlockedIdentifiers,
					usernameBlockedIdentifiers,
					validationPattern: validationPatternForRoomName,
				},
			},
			isCreatingOnBehalfOf,
			members,
			teamId,
			isTeamDefaultRoom: isTeamDefaultRoom || false,
			isTeamMainRoom: isTeamMainRoom || false,
		});
		await this.checkIfNameAlreadyExists(newRoom.room.name);

		if (!newRoom) {
			throw new Error('Could not create a room');
		}
		await this.roomRepository.insertOneWithExtraData(newRoom.room, roomExtraData);
		await this.subscriptionRepository.insertManyWithExtraData(newRoom.memberships, subscriptionExtraData);

		return newRoom.room._id; // TODO: this should not be returned, kept it here for compatibility
	}

	public async createPublicDiscussionRoomAndMembershipInsideTeam(
		{ name, displayName, ownerId, membersUsername, isReadonly, isCreatingOnBehalfOf, teamId, parentRoomId }: CreateRoomParams,
		roomExtraData?: Record<string, any>,
		subscriptionExtraData?: Record<string, any>,
	): Promise<string> {
		if (!parentRoomId) {
			throw new Error('Cannot create a discussion inside a team without the teamId');
		}
		if (!teamId) {
			throw new Error('Cannot create a discussion inside a team without the teamId');
		}
		if (!(await this.teamBasicReader.findOneById(teamId))) {
			throw new Error('Could not find the provided team');
		}
		const [owner, members] = await Promise.all([this.validateAndReturnOwner(ownerId), this.validateAndReturnMembers(membersUsername)]);

		const newRoom = createPublicDiscussionAndMembershipInsideTeam({
			owner: owner as Owner,
			isReadonly,
			name,
			isCreatingOnBehalfOf,
			members,
			teamId,
			parentRoomId,
			displayName: displayName || name, // TODO: improve this after refactoring all create room flow, this is here to circumvent the workaround with name and display names in the original function
		});
		await this.checkIfNameAlreadyExists(newRoom.room.name);

		if (!newRoom) {
			throw new Error('Could not create a room');
		}
		await this.roomRepository.insertOneWithExtraData(newRoom.room, roomExtraData);
		await this.subscriptionRepository.insertManyWithExtraData(newRoom.memberships, subscriptionExtraData);

		return newRoom.room._id; // TODO: this should not be returned, kept it here for compatibility
	}

	public async createPrivateDiscussionRoomAndMembershipInsideTeam(
		{ name, displayName, ownerId, membersUsername, isReadonly, isCreatingOnBehalfOf, parentRoomId, teamId }: CreateRoomParams,
		roomExtraData?: Record<string, any>,
		subscriptionExtraData?: Record<string, any>,
	): Promise<string> {
		if (!parentRoomId) {
			throw new Error('Cannot create a discussion inside a team without the teamId');
		}
		if (!teamId) {
			throw new Error('Cannot create a discussion inside a team without the teamId');
		}
		if (!(await this.teamBasicReader.findOneById(teamId))) {
			throw new Error('Could not find the provided team');
		}
		const [owner, members] = await Promise.all([this.validateAndReturnOwner(ownerId), this.validateAndReturnMembers(membersUsername)]);

		const newRoom = createPrivateDiscussionAndMembershipInsideTeam({
			owner: owner as Owner,
			isReadonly,
			name,
			isCreatingOnBehalfOf,
			members,
			teamId,
			parentRoomId,
			displayName: displayName || name, // TODO: improve this after refactoring all create room flow, this is here to circumvent the workaround with name and display names in the original function
		});
		await this.checkIfNameAlreadyExists(newRoom.room.name);

		if (!newRoom) {
			throw new Error('Could not create a room');
		}
		await this.roomRepository.insertOneWithExtraData(newRoom.room, roomExtraData);
		await this.subscriptionRepository.insertManyWithExtraData(newRoom.memberships, subscriptionExtraData);
		return newRoom.room._id; // TODO: this should not be returned, kept it here for compatibility
	}

	public async createPublicDiscussionAndMembership(
		{ name, ownerId, membersUsername, isReadonly, isCreatingOnBehalfOf, parentRoomId, displayName }: CreateRoomParams,
		roomExtraData?: Record<string, any>,
		subscriptionExtraData?: Record<string, any>,
	): Promise<string> {
		if (!parentRoomId) {
			throw new Error('Cannot create a room inside a team without the teamId');
		}
		const [owner, members] = await Promise.all([this.validateAndReturnOwner(ownerId), this.validateAndReturnMembers(membersUsername)]);

		const newRoom = createPublicDiscussionAndMembership({
			owner: owner as Owner,
			isReadonly,
			name,
			isCreatingOnBehalfOf,
			members,
			parentRoomId,
			displayName: displayName || name, // TODO: improve this after refactoring all create room flow, this is here to circumvent the workaround with name and display names in the original function
		});

		if (!newRoom) {
			throw new Error('Could not create a room');
		}
		await this.roomRepository.insertOneWithExtraData(newRoom.room, roomExtraData);
		await this.subscriptionRepository.insertManyWithExtraData(newRoom.memberships, subscriptionExtraData);

		return newRoom.room._id; // TODO: this should not be returned, kept it here for compatibility
	}

	public async createPrivateDiscussionAndMembership(
		{ name, ownerId, membersUsername, isReadonly, isCreatingOnBehalfOf, parentRoomId, displayName }: CreateRoomParams,
		roomExtraData?: Record<string, any>,
		subscriptionExtraData?: Record<string, any>,
	): Promise<string> {
		if (!parentRoomId) {
			throw new Error('Cannot create a room inside a team without the teamId');
		}
		const [owner, members] = await Promise.all([this.validateAndReturnOwner(ownerId), this.validateAndReturnMembers(membersUsername)]);

		const newRoom = createPrivateDiscussionAndMembership({
			owner: owner as Owner,
			isReadonly,
			name,
			isCreatingOnBehalfOf,
			members,
			parentRoomId,
			displayName: displayName || name, // TODO: improve this after refactoring all create room flow, this is here to circumvent the workaround with name and display names in the original function
		});

		if (!newRoom) {
			throw new Error('Could not create a room');
		}
		await this.roomRepository.insertOneWithExtraData(newRoom.room, roomExtraData);
		await this.subscriptionRepository.insertManyWithExtraData(newRoom.memberships, subscriptionExtraData);

		return newRoom.room._id; // TODO: this should not be returned, kept it here for compatibility
	}

	private async validateAndReturnOwner(ownerId: string): Promise<IUserDTO> {
		const owner = await this.iamConsumer.getUserById(ownerId);
		if (!owner) {
			throw new Error('Owner not found');
		}

		return owner;
	}

	private async validateAndReturnMembers(membersUsername: string[]): Promise<Member[]> {
		if (Array.isArray(membersUsername) && !membersUsername.every((member) => typeof member === 'string')) {
			throw new Error('Should provide usernames only for as members');
		}
		const members = (await Promise.all(membersUsername.map((username) => this.iamConsumer.getUserByUsername(username)))).filter(Boolean);

		return members as Member[];
	}

	private async checkIfNameAlreadyExists(displayName: string): Promise<void> {
		const room = await this.roomRepository.findOneByDisplayName(displayName, { fields: { _id: true, archived: true } }); // TODO: this needs to be revisited since the old logic doesn't look consistent, it was comparing the name field against the displayName
		if (room) {
			if (room.isArchived) {
				throw new Error(`There's an archived channel with name ${displayName}`);
			}
			throw new Error(`A channel with name '${displayName}' exists`);
		}
	}
}
