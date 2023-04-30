import { Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import * as authController from "controllers/auth-controller";

const getAuthRouter = (): Router => {
  const authRouter = Router();

  authRouter.post("/", (request, response, next) => {
    authController
      .authUser(request.body)
      .then((authorization) =>
        response.send({
          authorization,
          message: ReasonPhrases.OK,
          status: StatusCodes.OK,
        })
      )
      .catch(next);
  });

  return authRouter;
};

export default getAuthRouter;
