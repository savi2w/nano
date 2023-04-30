import { v4 as uuid } from "uuid";
import * as yup from "yup";

import { NotFoundError } from "errors";
import { getDocumentPattern } from "utils";
import { User as UserEntity } from "entities/user-entity";
import * as transactionModel from "models/transaction-model";
import * as userModel from "models/user-model";

const transactionSchema = yup
  .object()
  .shape({
    document: yup.string().matches(getDocumentPattern()).required(),
    value: yup.number().integer().positive().required(),
  })
  .noUnknown()
  .required();

export const createTransaction = async (
  payload: unknown,
  fromUser: UserEntity
): Promise<void> => {
  const transactionPayload = await transactionSchema.validate(payload);
  const toUser = await userModel.getUserByDocument(transactionPayload.document);
  if (!toUser) {
    throw new NotFoundError();
  }

  await transactionModel.createTransaction({
    transactionGUID: uuid(),
    fromUser,
    toUser,
    value: transactionPayload.value,
  });

  return undefined;
};

const timeRangeSchema = yup
  .object()
  .shape({
    startDate: yup.date().required(),
    endDate: yup.date().required(),
  })
  .noUnknown()
  .required();

export const getTransactionsByTimeRange = async (
  payload: unknown,
  user: UserEntity
): Promise<unknown[]> => {
  if (!user.userId) {
    throw new TypeError('"userId" should be a number');
  }

  const timeRange = await timeRangeSchema.validate(payload);
  const transactions = await transactionModel.getTransactionsByTimeRange(
    timeRange.startDate,
    timeRange.endDate,
    user.userId
  );

  return transactions.map((transaction) => ({
    transactionGUID: transaction.transactionGUID,
    createdAt: transaction.createdAt,
    toUser: {
      document: transaction.toUser.document,
      firstName: transaction.toUser.firstName,
      lastName: transaction.toUser.lastName,
    },
    type: transaction.type,
    value: transaction.value,
  }));
};
