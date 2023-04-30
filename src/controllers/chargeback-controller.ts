import { v4 as uuid } from "uuid";
import * as yup from "yup";

import { ForbiddenError, NotFoundError, UnauthorizedError } from "errors";
import { User as UserEntity } from "entities/user-entity";
import * as chargebackModel from "models/chargeback-model";
import * as transactionModel from "models/transaction-model";

const chargebackSchema = yup
  .object()
  .shape({
    transactionGUID: yup.string().required(),
  })
  .noUnknown()
  .required();

export const createChargeback = async (
  payload: unknown,
  user: UserEntity
): Promise<void> => {
  const chargebackPayload = await chargebackSchema.validate(payload);
  const targetTransaction = await transactionModel.getTransactionByGUID(
    chargebackPayload.transactionGUID
  );

  if (!targetTransaction) {
    throw new NotFoundError();
  }

  if (!targetTransaction.transactionId) {
    throw new TypeError('"transactionId" should be a number');
  }

  const existingChargeback = await chargebackModel.getChargebackByTargetId(
    targetTransaction.transactionId
  );

  if (existingChargeback) {
    throw new ForbiddenError();
  }

  if (user.userId !== targetTransaction.fromUser.userId) {
    throw new UnauthorizedError();
  }

  const chargebackTransaction = {
    transactionGUID: uuid(),
    fromUser: targetTransaction.toUser,
    toUser: targetTransaction.fromUser,
    value: targetTransaction.value,
  };

  await chargebackModel.createChargeback(
    chargebackTransaction,
    targetTransaction
  );

  return undefined;
};
