import { ExternalHttpUnitTestFactory } from '@rocket.chat/fuel/dist/testing';
import type { Express } from 'express';
import type { Response } from 'supertest';
import supertest from 'supertest';

import { OmnichannelCommandsController } from './rooms';

describe('[API - Commands - Omnichannel] - Room', () => {
	let app: Express;

	beforeAll(async () => {
		const response = await ExternalHttpUnitTestFactory.create(OmnichannelCommandsController, { validateInput: true, transformInput: true });
		app = response.app;
	});

	afterEach(() => jest.restoreAllMocks());

	describe('#createRoom()', () => {
		it('should return an error when required "name" property is not provided', () => {
			return supertest(app)
				.post('/api/v2/omnichannel/rooms')
				.send({
					exampleIds: ['id'],
				})
				.expect('Content-Type', 'application/json; charset=utf-8')
				.expect(400)
				.expect((res: Response) => {
					const { body } = res;
					expect({
						input: { name: body.name, errors: body.errors },
						errorName: 'BadRequestError',
						errors: {
							name: {
								isString: 'name must be a string',
							},
						},
						// @ts-ignore
					}).toMatchExternalAPIValidationErrors();
				});
		});

		it('should return an error when required "name" property is not a string', () => {
			return supertest(app)
				.post('/api/v2/omnichannel/rooms')
				.send({
					name: false,
				})
				.expect('Content-Type', 'application/json; charset=utf-8')
				.expect(400)
				.expect((res: Response) => {
					const { body } = res;
					expect({
						input: { name: body.name, errors: body.errors },
						errorName: 'BadRequestError',
						errors: {
							name: {
								isString: 'name must be a string',
							},
						},
						// @ts-ignore
					}).toMatchExternalAPIValidationErrors();
				});
		});

		it('should return an error when required "exampleIds" property is not provided', () => {
			return supertest(app)
				.post('/api/v2/omnichannel/rooms')
				.send({
					name: 'name',
				})
				.expect('Content-Type', 'application/json; charset=utf-8')
				.expect(400)
				.expect((res: Response) => {
					const { body } = res;
					expect({
						input: { name: body.name, errors: body.errors },
						errorName: 'BadRequestError',
						errors: {
							exampleIds: {
								isArray: 'exampleIds must be an array',
							},
						},
						// @ts-ignore
					}).toMatchExternalAPIValidationErrors();
				});
		});

		it('should return an error when required "exampleIds" AND "name" properties are not provided', () => {
			return supertest(app)
				.post('/api/v2/omnichannel/rooms')
				.send({})
				.expect('Content-Type', 'application/json; charset=utf-8')
				.expect(400)
				.expect((res: Response) => {
					const { body } = res;
					expect({
						input: { name: body.name, errors: body.errors },
						errorName: 'BadRequestError',
						errors: {
							name: {
								isString: 'name must be a string',
							},
							exampleIds: {
								isArray: 'exampleIds must be an array',
							},
						},
						// @ts-ignore
					}).toMatchExternalAPIValidationErrors();
				});
		});

		it('should return an error when optional "example" is not a string', () => {
			return supertest(app)
				.post('/api/v2/omnichannel/rooms')
				.send({
					name: 'name',
					exampleIds: ['id'],
					example: true,
				})
				.expect('Content-Type', 'application/json; charset=utf-8')
				.expect(400)
				.expect((res: Response) => {
					const { body } = res;
					expect({
						input: { name: body.name, errors: body.errors },
						errorName: 'BadRequestError',
						errors: {
							example: {
								isString: 'example must be a string',
							},
						},
						// @ts-ignore
					}).toMatchExternalAPIValidationErrors();
				});
		});

		it('should return an error when optional "when" is not a string', () => {
			return supertest(app)
				.post('/api/v2/omnichannel/rooms')
				.send({
					name: 'name',
					exampleIds: ['id'],
					example: 'true',
					when: 12,
				})
				.expect('Content-Type', 'application/json; charset=utf-8')
				.expect(400)
				.expect((res: Response) => {
					const { body } = res;
					expect({
						input: { name: body.name, errors: body.errors },
						errorName: 'BadRequestError',
						errors: {
							when: {
								isString: 'when must be a string',
							},
						},
						// @ts-ignore
					}).toMatchExternalAPIValidationErrors();
				});
		});
	});
});
