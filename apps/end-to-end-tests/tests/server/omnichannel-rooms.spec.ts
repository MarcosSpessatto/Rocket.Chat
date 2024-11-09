import type { Response } from 'supertest';
import supertest from 'supertest';

import { OmnichannelRoomBuilder } from './data-builders/omnichannel-rooms';

const baseurl = 'http://localhost:3000';

describe('End-to-end tests [Server]', () => {
	describe('API Gateway', () => {
		describe('Omnichannel - Rooms', () => {
			let rooms: any[] = [];

			describe('[/api/v2/omnichannel/rooms] - POST', () => {
				it('should create an omnichannel room correctly', async () => {
					return supertest(baseurl)
						.post('/api/v2/omnichannel/rooms')
						.send(OmnichannelRoomBuilder.aRoom().build())
						.expect('Content-Type', 'application/json; charset=utf-8')
						.expect(201);
				});
			});

			describe('[/api/v2/omnichannel/rooms] - GET', () => {
				it('should return the list of created omnichannel rooms', async () => {
					return supertest(baseurl)
						.get(`/api/v2/omnichannel/rooms`)
						.expect('Content-Type', 'application/json; charset=utf-8')
						.expect(200)
						.expect((res: Response) => {
							rooms = rooms.concat(res.body);

							expect(rooms.length).toBeGreaterThanOrEqual(1);
							expect(Object.keys(rooms[0])).toEqual([
								'_id',
								'membersCounter',
								'msgsCounter',
								'type',
								'name',
								'owner',
								'displayName',
								'membersIds',
								'createdAt',
							]);
						});
				});
			});

			describe('[/api/v2/omnichannel/rooms] - DELETE', () => {
				it('should delete an omnichannel room correctly', async () => {
					return supertest(baseurl)
						.delete(`/api/v2/omnichannel/rooms/${(rooms[0] as any)._id}`)
						.expect('Content-Type', 'application/json; charset=utf-8')
						.expect(200);
				});
			});
		});
	});
});
