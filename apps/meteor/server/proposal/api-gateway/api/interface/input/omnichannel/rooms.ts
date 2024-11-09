import { IsArray, IsOptional, IsString } from '@rocket.chat/fuel';

export class CreateOmnichannelRoomInputPayload {
	@IsString()
	name: string;

	@IsArray()
	exampleIds: string[];

	@IsOptional()
	@IsString()
	example: string;

	@IsOptional()
	@IsString()
	when?: string;
}
