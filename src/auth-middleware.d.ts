import { User as UserEntity } from "entities/user-entity";

declare global {
  namespace Express {
    export interface Request {
      user: UserEntity;
    }
  }
}
