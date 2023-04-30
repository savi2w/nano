import { getManager } from "typeorm";

import { InsufficientBalanceError } from "errors";
import { Chargeback as ChargebackEntity } from "entities/chargeback-entity";
import {
  Transaction as TransactionEntity,
  TransactionType,
} from "entities/transaction-entity";
import { User as UserEntity } from "entities/user-entity";

export const createChargeback = async (
  transaction: TransactionEntity,
  targetTransaction: TransactionEntity
): Promise<void> =>
  getManager().transaction("SERIALIZABLE", async (entityManager) => {
    const fromUser = await entityManager.findOneOrFail(UserEntity, {
      userId: transaction.fromUser.userId,
    });

    const fromUserBalance = fromUser.balance - transaction.value;
    if (fromUserBalance < 0) {
      throw new InsufficientBalanceError();
    }

    await entityManager.update(UserEntity, fromUser.userId, {
      balance: fromUserBalance,
    });

    const toUser = await entityManager.findOneOrFail(UserEntity, {
      userId: transaction.toUser.userId,
    });

    const toUserBalance = toUser.balance + transaction.value;

    await entityManager.update(UserEntity, toUser.userId, {
      balance: toUserBalance,
    });

    const chargebackTransaction = await entityManager.save(TransactionEntity, {
      ...transaction,
      type: TransactionType.CHARGEBACK,
    });

    await entityManager.insert(ChargebackEntity, {
      chargebackTransaction,
      targetTransaction,
    });
  });

export const getChargebackByTargetId = (
  targetId: number
): Promise<ChargebackEntity | undefined> =>
  getManager().findOne(ChargebackEntity, {
    targetTransaction: {
      transactionId: targetId,
    },
  });
