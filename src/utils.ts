import { sha256 } from "js-sha256";
import JWT from "jsonwebtoken";

export const getDocumentPattern = (): RegExp => /^[0-9]{11}$/;

export const getPasswordHash = (password: string): string => {
  const salt = process.env.PASSWORD_SALT;
  if (!salt) {
    throw new TypeError('"salt" should be a string');
  }

  return sha256([password, salt].join("#"));
};

export const signJWT = (payload: Record<string, string>): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new TypeError('"secret" should be a string');
  }

  const options = {
    expiresIn: "12h",
  };

  return "Bearer " + JWT.sign(payload, secret, options);
};

export const verifyJWT = (authorization: string): unknown => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new TypeError('"secret" should be a string');
  }

  return JWT.verify(authorization.split("Bearer ").join(""), secret);
};
