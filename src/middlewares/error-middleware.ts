import { Request, Response, NextFunction } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { CustomError } from "errors";

const getErrorMiddleware = () => (
  error: CustomError,
  _: Request,
  response: Response,
  next: NextFunction
): void => {
  /**
   * Catch custom errors
   */
  if (error.status) {
    response.send({
      message: error.message,
      status: error.status,
    });

    return next();
  }

  /**
   * Catch errors from yup validate
   */
  if (error.name?.includes("ValidationError")) {
    response.send({
      message: error.message,
      status: StatusCodes.BAD_REQUEST,
    });

    return next();
  }

  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }

  response.send({
    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    status: StatusCodes.INTERNAL_SERVER_ERROR,
  });

  return next();
};

export default getErrorMiddleware;
