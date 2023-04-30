import { getManager } from "typeorm";

import { User as UserEntity } from "entities/user-entity";

export const createUser = async (user: UserEntity): Promise<unknown> =>
  getManager().insert(UserEntity, user);

export const getUserByDocument = async (
  document: string
): Promise<UserEntity | undefined> =>
  getManager().findOne(UserEntity, {
    document,
  });

export const getUserByDocumentAndPassword = async (
  document: string,
  password: string
): Promise<UserEntity | undefined> =>
  getManager().findOne(UserEntity, {
    document,
    password,
  });

export const getUserByGUID = async (
  userGUID: string
): Promise<UserEntity | undefined> =>
  getManager().findOne(UserEntity, {
    userGUID,
  });
