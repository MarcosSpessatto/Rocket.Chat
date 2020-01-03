import { MongoDbUserRepository } from '../../infrastructure';
import { GetUserStatus } from '../../core';
import { Users } from '../../../app/models/server';

const userRepository = new MongoDbUserRepository(Users.model.rawCollection());

export const getUserStatusUseCase = new GetUserStatus(userRepository);
