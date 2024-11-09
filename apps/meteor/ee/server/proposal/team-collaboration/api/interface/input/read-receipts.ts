import { IsString } from '@rocket.chat/fuel';

export class GetReadReceiptsQuery {
	@IsString()
	messageId: string;
}
