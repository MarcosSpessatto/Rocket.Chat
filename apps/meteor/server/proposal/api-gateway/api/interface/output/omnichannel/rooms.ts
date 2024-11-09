import { IsString, IsOptional, IsNumber, IsDateString } from '@rocket.chat/fuel';

export class OmnichannelRoomOutputDTO {
	@IsString()
	_id: string;

	@IsString()
	type: 'l';

	@IsString()
	name: string;

	@IsString()
	@IsOptional()
	displayName: string;

	@IsString()
	@IsOptional()
	@IsNumber()
	msgsCounter: number;

	@IsString()
	@IsOptional()
	@IsDateString()
	createdAt: string;

	@IsString()
	@IsOptional()
	@IsNumber()
	membersCounter: number;
}
