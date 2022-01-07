// https://stackoverflow.com/questions/60014874/how-to-use-typescript-with-sequelize
require("dotenv").config({ path: require("path").resolve(".env") });
import * as sequelize from "sequelize";
import { ActivityFactory, ActivityStatic } from "./models/activity_model";
import {
  AccessTokenFactory,
  AccessTokenStatic
} from "./models/access_token_model";
import {
  RefreshTokenFactory,
  RefreshTokenStatic
} from "./models/refresh_token_model";
export const dbConfig = new sequelize.Sequelize(
  process.env.PG_DATABASE || "",
  process.env.PG_USER || "",
  process.env.PG_PASS,
  {
    host: process.env.PG_HOST,
    dialect: "postgres",
    logging: false,
    pool: {
      min: 0,
      max: 5,
      acquire: 30000,
      idle: 10000
    }
  }
);

const Activity = ActivityFactory(dbConfig);
const AccessToken = AccessTokenFactory(dbConfig);
const RefreshToken = RefreshTokenFactory(dbConfig);

// const model = (name: string) => database.models[name];
const database: {
  sequelize: any;
  models: {
    Activity: ActivityStatic;
    AccessToken: AccessTokenStatic;
    RefreshToken: RefreshTokenStatic;
  };
  // model: any;
} = {
  sequelize: sequelize,
  models: { Activity, AccessToken, RefreshToken }
  // model
};

export default database;
