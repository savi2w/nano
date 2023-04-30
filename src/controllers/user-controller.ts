import { v4 as uuid } from "uuid";
import * as yup from "yup";

import { DuplicateError, NotFoundError } from "errors";
import { getDocumentPattern, getPasswordHash } from "utils";

import { User as UserEntity } from "entities/user-entity";
import * as userModel from "models/user-model";

const userSchema = yup
  .object()
  .shape({
    balance: yup.number().integer().required(),
    document: yup.string().matches(getDocumentPattern()).required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    password: yup.string().required(),
  })
  .noUnknown()
  .required();

export const createUser = async (payload: unknown): Promise<void> => {
  const userPayload = await userSchema.validate(payload);
  const existingUser = await userModel.getUserByDocument(userPayload.document);
  if (existingUser) {
    throw new DuplicateError();
  }

  await userModel.createUser({
    ...userPayload,
    userGUID: uuid(),
    password: getPasswordHash(userPayload.password),
  });

  return undefined;
};

export const getBalance = async ({ document }: UserEntity): Promise<number> => {
  const user = await userModel.getUserByDocument(document);
  if (!user) {
    throw new NotFoundError();
  }

  return user.balance;
};
