import { Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import * as userController from "controllers/user-controller";
import getAuthMiddleware from "middlewares/auth-middleware";

const getUserRouter = (): Router => {
  const userRouter = Router();

  userRouter.post("/", (request, response, next) => {
    userController
      .createUser(request.body)
      .then(() =>
        response.send({
          message: ReasonPhrases.CREATED,
          status: StatusCodes.CREATED,
        })
      )
      .catch(next);
  });

  userRouter.use(getAuthMiddleware());

  userRouter.get("/balance", (request, response, next) => {
    userController
      .getBalance(request.user)
      .then((balance) =>
        response.send({
          balance,
          message: ReasonPhrases.OK,
          status: StatusCodes.OK,
        })
      )
      .catch(next);
  });

  return userRouter;
};

export default getUserRouter;
