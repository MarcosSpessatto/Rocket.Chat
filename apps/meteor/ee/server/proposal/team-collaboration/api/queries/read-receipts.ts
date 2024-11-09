import {
	ExternalHttpController,
	HttpCode,
	injectable,
	JsonController,
	OpenAPI,
	inject,
	Get,
	ResponseSchema,
	MongoDBBaseReader,
	QueryParams,
} from '@rocket.chat/fuel';
import type { ReadOnlyCollection } from '@rocket.chat/fuel/dist/internals';
import { IDependencyContainerReader, IMongoDBReaderInteractor } from '@rocket.chat/fuel/dist/internals';
import type { Collection } from 'mongodb';

import { GetReadReceiptsQuery } from '../interface/input/read-receipts';
import { ReadReceiptsOutputDTO } from '../interface/output/read-receipts';

@injectable()
export class MessageReader extends MongoDBBaseReader {
	private collection: ReadOnlyCollection<Collection>;

	constructor(
		protected collectionName: string,
		protected dbAdapter: IMongoDBReaderInteractor,
		protected dependencyContainerReader: IDependencyContainerReader,
	) {
		super(collectionName, dbAdapter, dependencyContainerReader);
		this.collection = this.dbAdapter.collection(collectionName);
	}

	public async getReadReceiptsByMessageId(messageId: string): Promise<any> {
		return this.collection.find({ messageId });
	}

	public static collectionName(): string {
		return 'rocketchat_read_receipts';
	}
}

@injectable()
@JsonController('/api/v2/messages')
@OpenAPI({
	security: [{ apiKey: [] }],
})
export class MessagesQueriesController extends ExternalHttpController {
	constructor(@inject('MessageReader') private messageReader: MessageReader) {
		super();
	}

	@OpenAPI({
		security: [{ apiKey: [] }],
		description: 'Retrieves all message read receipts',
		responses: {
			'200': {
				description: 'Success',
			},
		},
	})
	@ResponseSchema(ReadReceiptsOutputDTO, { contentType: 'application/json', isArray: true, statusCode: 200 })
	@HttpCode(200)
	@Get('/read-receipts')
	public async getAllReadReceipts(@QueryParams() query: GetReadReceiptsQuery): Promise<ReadReceiptsOutputDTO[]> {
		const receipts = await this.messageReader.getReadReceiptsByMessageId(query.messageId);

		return receipts.map((receipt: any) => ({
			_id: receipt._id,
			userId: receipt.userId,
			messageId: receipt.messageId,
		}));
	}
}
