import {
	ExternalHttpController,
	HttpCode,
	injectable,
	JsonController,
	OpenAPI,
	Post,
	Body,
	inject,
	Delete,
	Param,
	OnUndefined,
} from '@rocket.chat/fuel';

import { OmnichannelModuleConsumer } from '../../../infrastructure/external-module-integration/consumer/omnichannel';
import { CreateOmnichannelRoomInputPayload } from '../../interface/input/omnichannel/rooms';

@injectable()
@JsonController('/api/v2/omnichannel')
@OpenAPI({
	security: [{ apiKey: [] }],
})
export class OmnichannelCommandsController extends ExternalHttpController {
	constructor(@inject('OmnichannelModuleConsumer') private omnichannelModuleConsumer: OmnichannelModuleConsumer) {
		super();
	}

	@OpenAPI({
		security: [{ apiKey: [] }],
		description: 'Creates an omnichannel room',
		responses: {
			'400': {
				description: 'Bad request',
			},
		},
	})
	@HttpCode(201)
	@OnUndefined(201)
	@Post('/rooms')
	public async createRoom(@Body() input: CreateOmnichannelRoomInputPayload): Promise<void> {
		await this.omnichannelModuleConsumer.createOmnichannelRoom(input);
	}

	@OpenAPI({
		security: [{ apiKey: [] }],
		description: 'Deletes an omnichannel room',
		responses: {
			'400': {
				description: 'Bad request',
			},
		},
	})
	@HttpCode(200)
	@OnUndefined(200)
	@Delete('/rooms/:roomId')
	public async deleteRoom(@Param('roomId') roomId: string): Promise<void> {
		return this.omnichannelModuleConsumer.deleteRoom(roomId);
	}
}
