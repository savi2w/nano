import { getManager, Between } from "typeorm";

import { InsufficientBalanceError } from "errors";
import { Transaction as TransactionEntity } from "entities/transaction-entity";
import { User as UserEntity } from "entities/user-entity";

export const createTransaction = async (
  transaction: TransactionEntity
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

    await entityManager.insert(TransactionEntity, transaction);
  });

export const getTransactionByGUID = async (
  transactionGUID: string
): Promise<TransactionEntity | undefined> => {
  const where = {
    transactionGUID,
  };

  const options = {
    relations: ["fromUser", "toUser"],
  };

  return getManager().findOne(TransactionEntity, where, options);
};

export const getTransactionsByTimeRange = async (
  startDate: Date,
  endDate: Date,
  userId: number
): Promise<TransactionEntity[]> =>
  getManager().find(TransactionEntity, {
    relations: ["toUser"],
    where: {
      createdAt: Between(startDate, endDate),
      fromUser: {
        userId,
      },
    },
  });
