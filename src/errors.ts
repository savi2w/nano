import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class CustomError extends Error {
  public message: string;
  public status?: number;
}

export class DuplicateError extends CustomError {
  constructor() {
    super();

    this.message = "Duplicate entry error";
    this.status = StatusCodes.CONFLICT;
  }
}

export class ForbiddenError extends CustomError {
  constructor() {
    super();

    this.message = ReasonPhrases.FORBIDDEN;
    this.status = StatusCodes.FORBIDDEN;
  }
}

export class InsufficientBalanceError extends CustomError {
  constructor() {
    super();

    this.message = "Insufficient balance error";
    this.status = StatusCodes.PAYMENT_REQUIRED;
  }
}

export class NotFoundError extends CustomError {
  constructor() {
    super();

    this.message = ReasonPhrases.NOT_FOUND;
    this.status = StatusCodes.NOT_FOUND;
  }
}

export class UnauthorizedError extends CustomError {
  constructor() {
    super();

    this.message = ReasonPhrases.UNAUTHORIZED;
    this.status = StatusCodes.UNAUTHORIZED;
  }
}
