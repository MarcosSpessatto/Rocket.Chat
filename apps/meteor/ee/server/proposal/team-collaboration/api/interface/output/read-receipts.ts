import { IsString } from '@rocket.chat/fuel';

export class ReadReceiptsOutputDTO {
	@IsString()
	_id: string;

	@IsString()
	messageId: string;

	@IsString()
	userId: string;
}
