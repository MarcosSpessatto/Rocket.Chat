import { IsArray, IsBoolean, IsOptional, IsString } from '@rocket.chat/fuel';

export class CreateRoomInputPayload {
	@IsString()
	name: string;

	@IsString()
	ownerId: string;

	@IsArray()
	membersId: string[];

	@IsOptional()
	@IsBoolean()
	isReadonly?: boolean;

	@IsOptional()
	@IsBoolean()
	creatingOnBehalfOf?: boolean;
}
