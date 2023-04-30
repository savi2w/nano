import { Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import getAuthMiddleware from "middlewares/auth-middleware";
import * as transactionController from "controllers/transaction-controller";

const getTransactionRouter = (): Router => {
  const transactionRouter = Router();

  transactionRouter.use(getAuthMiddleware());

  transactionRouter.post("/", (request, response, next) => {
    transactionController
      .createTransaction(request.body, request.user)
      .then(() =>
        response.send({
          message: ReasonPhrases.CREATED,
          status: StatusCodes.CREATED,
        })
      )
      .catch(next);
  });

  transactionRouter.get("/:startDate/:endDate", (request, response, next) => {
    transactionController
      .getTransactionsByTimeRange(request.params, request.user)
      .then((transactions) => {
        response.send({
          message: ReasonPhrases.OK,
          status: StatusCodes.OK,
          transactions,
        });
      })
      .catch(next);
  });

  return transactionRouter;
};

export default getTransactionRouter;
