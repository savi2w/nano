import "reflect-metadata";

import express from "express";
import { createConnection } from "typeorm";

import ormConfig from "config/orm-config";
import getErrorMiddleware from "middlewares/error-middleware";
import getAuthRouter from "routers/auth-router";
import getChargebackRouter from "routers/chargeback-router";
import getTransactionRouter from "routers/transaction-router";
import getUserRouter from "routers/user-router";

const getServer = () => {
  const application = express();

  application.use(express.json());

  application.use("/auth", getAuthRouter());
  application.use("/chargeback", getChargebackRouter());
  application.use("/transaction", getTransactionRouter());
  application.use("/user", getUserRouter());

  application.use(getErrorMiddleware());

  return application;
};

createConnection(ormConfig).then(() => {
  getServer().listen(process.env.APP_PORT, () => {
    console.log("Listening!");
  });
});
