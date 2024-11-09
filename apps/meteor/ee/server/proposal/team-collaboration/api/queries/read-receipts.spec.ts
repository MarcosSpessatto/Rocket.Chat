import type { SolitaryUnitTestDependencyAdapter } from '@rocket.chat/fuel/dist/testing';
import { ExternalHttpUnitTestFactory } from '@rocket.chat/fuel/dist/testing';
import type { Express } from 'express';
import type { Response } from 'supertest';
import supertest from 'supertest';

import type { MessageReader } from './read-receipts';
import { MessagesQueriesController } from './read-receipts';

describe('[API - Team Collaboration EE - Queries] - Read Receipts', () => {
	let app: Express;
	let dependenciesAdapter: SolitaryUnitTestDependencyAdapter;

	beforeAll(async () => {
		const response = await ExternalHttpUnitTestFactory.create(MessagesQueriesController, { validateInput: true, transformInput: true });
		app = response.app;
		dependenciesAdapter = response.dependenciesAdapter;
	});

	afterEach(() => jest.restoreAllMocks());

	describe('#getAllReadReceipts()', () => {
		it('should return an error when required query param "messageId" is not provided', () => {
			return supertest(app)
				.get('/api/v2/messages/read-receipts')
				.expect('Content-Type', 'application/json; charset=utf-8')
				.expect(400)
				.expect((res: Response) => {
					const { body } = res;
					expect({
						input: { name: body.name, errors: body.errors },
						errorName: 'BadRequestError',
						errors: {
							messageId: {
								isString: 'messageId must be a string',
							},
						},
						// @ts-ignore
					}).toMatchExternalAPIValidationErrors();
				});
		});

		it('should return sucessfull response matching the output DTO', () => {
			const responseFromDb = { _id: '_id', userId: 'userId', messageId: 'messageId', extraProp: 'extraProp' };
			dependenciesAdapter.get<MessageReader>('MessageReader').getReadReceiptsByMessageId.mockResolvedValue([responseFromDb]);

			return supertest(app)
				.get('/api/v2/messages/read-receipts')
				.query({
					messageId: true,
				})
				.expect('Content-Type', 'application/json; charset=utf-8')
				.expect(200)
				.expect((res: Response) => {
					const responseFromEndpoint = Object.assign({}, responseFromDb);
					// @ts-ignore
					delete responseFromEndpoint.extraProp;
					expect(res.body).toEqual([responseFromEndpoint]);
				});
		});
	});
});
