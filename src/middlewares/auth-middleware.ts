import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import { UnauthorizedError } from "errors";
import { verifyJWT } from "utils";

import redis from "config/redis-config";
import * as userModel from "models/user-model";

const authSchema = yup
  .object({
    userGUID: yup.string().required(),
  })
  .noUnknown()
  .required();

const ONE_HOUR = 3600;

const getAuthMiddleware = () => (
  request: Request,
  _: Response,
  next: NextFunction
): void => {
  Promise.resolve()
    .then(async () => {
      const authorization = request.header("authorization");
      if (!authorization) {
        throw new TypeError('"authorization" should be a string');
      }

      const payload = verifyJWT(authorization);
      const authPayload = await authSchema.validate(payload);

      const memoize = await redis.get(authPayload.userGUID);
      if (memoize) {
        request.user = JSON.parse(memoize);

        return next();
      }

      const user = await userModel.getUserByGUID(authPayload.userGUID);
      if (!user) {
        throw new TypeError('"user" should be a UserEntity');
      }

      await redis.set(
        authPayload.userGUID,
        JSON.stringify(user),
        "EX",
        ONE_HOUR
      );

      request.user = user;

      return next();
    })
    .catch(() => next(new UnauthorizedError()));
};

export default getAuthMiddleware;
