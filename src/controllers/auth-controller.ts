import * as yup from "yup";

import { UnauthorizedError } from "errors";
import { getDocumentPattern, getPasswordHash, signJWT } from "utils";

import * as userModel from "models/user-model";

const authSchema = yup
  .object()
  .shape({
    document: yup.string().matches(getDocumentPattern()).required(),
    password: yup.string().required(),
  })
  .noUnknown()
  .required();

export const authUser = async (payload: unknown): Promise<string> => {
  const authPayload = await authSchema.validate(payload);
  const user = await userModel.getUserByDocumentAndPassword(
    authPayload.document,
    getPasswordHash(authPayload.password)
  );

  if (!user) {
    throw new UnauthorizedError();
  }

  const JWT = signJWT({
    userGUID: user.userGUID,
  });

  return JWT;
};
