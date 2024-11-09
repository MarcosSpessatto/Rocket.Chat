import { FUEL_DI_TOKENS, IDBConnectionReaderFactory, inject, injectable, InMemoryExternalModuleProvider } from '@rocket.chat/fuel';
import type { IDBBasicReader } from '@rocket.chat/fuel/dist/internals';

import { isDiscussionRoom, isPrivateRoom, isPublicRoom } from '../../domain/room';
import { RoomService } from '../../services/room/room';
import type { CreateRoomParams, SettingsFromCore } from '../../shared/input/room-input';
import { RoomModel } from '../database/mongodb/schema/room';

@injectable()
export class TeamCollaborationModuleProvider extends InMemoryExternalModuleProvider {
	private roomBasicReader: IDBBasicReader;

	constructor(
		@inject(FUEL_DI_TOKENS.DB_CONNECTION_READER_FACTORY) private dbReaderFactory: IDBConnectionReaderFactory,
		@inject('RoomService') private roomService: RoomService,
	) {
		super();
		this.roomBasicReader = this.dbReaderFactory.createBasicReaderForEntity(RoomModel);
	}

	public async getAllRooms(): Promise<any> {
		return this.roomBasicReader.findAll();
	}

	public async createRoomAndMembership(
		input: CreateRoomParams & { settings: SettingsFromCore },
		roomExtraData?: Record<string, any>,
		subscriptionExtraData?: Record<string, any>,
	): Promise<string> {
		// TODO: needs to return string due to compatibility, after migrate all we can remove it
		const { type, teamId, parentRoomId } = input;
		const inputDisallowingDuplicatedNames = { ...input, options: { allowDuplicatedNames: false } };

		if (!type) {
			throw new Error('Room type was not provided');
		}
		if (!isPublicRoom({ type }) && !isPrivateRoom({ type })) {
			throw new Error('Room type was not supported yet');
		}

		// TODO: we should not handle the team's room creation here, it should be moved to inside the team's logic, here for compatibility
		if (isDiscussionRoom({ parentRoomId })) {
			if (teamId) {
				if (isPublicRoom({ type })) {
					return this.roomService.createPublicDiscussionRoomAndMembershipInsideTeam(
						inputDisallowingDuplicatedNames,
						roomExtraData,
						subscriptionExtraData,
					);
				}

				return this.roomService.createPrivateDiscussionRoomAndMembershipInsideTeam(
					inputDisallowingDuplicatedNames,
					roomExtraData,
					subscriptionExtraData,
				);
			}

			if (isPublicRoom({ type })) {
				return this.roomService.createPublicDiscussionAndMembership(inputDisallowingDuplicatedNames, roomExtraData, subscriptionExtraData);
			}

			return this.roomService.createPrivateDiscussionAndMembership(inputDisallowingDuplicatedNames, roomExtraData, subscriptionExtraData);
		}

		if (teamId) {
			if (isPublicRoom({ type })) {
				return this.roomService.createPublicRoomAndMembershipInsideTeam(
					inputDisallowingDuplicatedNames,
					roomExtraData,
					subscriptionExtraData,
				);
			}

			return this.roomService.createPrivateRoomAndMembershipInsideTeam(
				inputDisallowingDuplicatedNames,
				roomExtraData,
				subscriptionExtraData,
			);
		}

		if (isPublicRoom({ type })) {
			return this.roomService.createPublicRoomAndMembership(inputDisallowingDuplicatedNames, roomExtraData, subscriptionExtraData);
		}

		return this.roomService.createPrivateRoomAndMembership(inputDisallowingDuplicatedNames, roomExtraData, subscriptionExtraData);
	}
}
