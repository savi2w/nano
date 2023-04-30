import { Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import getAuthMiddleware from "middlewares/auth-middleware";
import * as chargebackController from "controllers/chargeback-controller";

const getChargebackRouter = (): Router => {
  const chargebackRouter = Router();

  chargebackRouter.use(getAuthMiddleware());

  chargebackRouter.post("/", (request, response, next) => {
    chargebackController
      .createChargeback(request.body, request.user)
      .then(() => {
        response.send({
          message: ReasonPhrases.CREATED,
          status: StatusCodes.CREATED,
        });
      })
      .catch(next);
  });

  return chargebackRouter;
};

export default getChargebackRouter;
