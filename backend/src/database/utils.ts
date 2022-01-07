import { WhereOptions } from "sequelize";
import {
  RefreshTokenAttributes,
  RefreshTokenStatic
} from "./models/refresh_token_model";
import {
  AccessTokenAttributes,
  AccessTokenStatic
} from "./models/access_token_model";
require("./config");

export const upsertAccess = async (
  Model: AccessTokenStatic,
  values: AccessTokenAttributes,
  condition: WhereOptions<{ athleteId: number }>
) => {
  const obj = await Model.findOne({ where: condition });

  if (obj) {
    console.log("updating access token");
    await obj.update(values);
    return;
  }
  console.log("creating access token");
  await Model.create(values);
  return;
};

export const upsertRefresh = async (
  Model: RefreshTokenStatic,
  values: RefreshTokenAttributes,
  condition: WhereOptions<{ athleteId: number }>
) => {
  const obj = await Model.findOne({ where: condition });

  if (obj) {
    console.log("updating refresh token");
    await obj.update(values);
    return;
  }
  console.log("creating refresh token");
  await Model.create(values);
  return;
};
