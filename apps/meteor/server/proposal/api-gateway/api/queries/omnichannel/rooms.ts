import { ExternalHttpController, HttpCode, injectable, JsonController, OpenAPI, inject, Get, ResponseSchema } from '@rocket.chat/fuel';

import { OmnichannelModuleConsumer } from '../../../infrastructure/external-module-integration/consumer/omnichannel';
import { OmnichannelRoomOutputDTO } from '../../interface/output/omnichannel/rooms';

@injectable()
@JsonController('/api/v2/omnichannel')
@OpenAPI({
	security: [{ apiKey: [] }],
})
export class OmnichannelQueriesController extends ExternalHttpController {
	constructor(@inject('OmnichannelModuleConsumer') private omnichannelModuleConsumer: OmnichannelModuleConsumer) {
		super();
	}

	@OpenAPI({
		security: [{ apiKey: [] }],
		description: 'Retrieves all omnichannel rooms',
		responses: {
			'200': {
				description: 'Success',
			},
		},
	})
	@ResponseSchema(OmnichannelRoomOutputDTO, { contentType: 'application/json', isArray: true, statusCode: 200 })
	@HttpCode(200)
	@Get('/rooms')
	public async getAllRooms(): Promise<any> {
		return this.omnichannelModuleConsumer.getAllRooms();
	}
}
