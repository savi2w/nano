import path from "path";
import { ConnectionOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const build = path.join(__dirname, "..");
const entities = [path.join(build, "entities", "*.js")];
const migrations = [path.join(build, "migrations", "*.js")];

const ormConfig: ConnectionOptions = {
  database: process.env.DB_NAME,
  entities,
  entityPrefix: "tb_",
  host: process.env.DB_HOST,
  migrations,
  namingStrategy: new SnakeNamingStrategy(),
  password: process.env.DB_PASSWORD,
  synchronize: true,
  type: "postgres",
  username: process.env.DB_USERNAME,
};

export = ormConfig;
