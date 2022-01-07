require("dotenv").config({ path: "configs/dotenv/.env" });
import * as express from "express";
import { Response } from "express";
const axios = require("axios");

import { upsertAccessToken, upsertRefreshToken } from "../database/controllers";

const authRouter = express.Router();

authRouter.get("/authLink", (_req, res) => {
  res.send(process.env.AUTH_LINK);
});

authRouter.get(
  "/exchange_token",
  // @ts-ignore (not all code paths return a value)
  async (
    { session, query: { error, scope, code: authCodeFromStrava } }: any,
    res: Response
  ) => {
    if (error === "access_denied") return res.send(error);
    const {
      data: {
        token_type,
        expires_at,
        refresh_token,
        access_token,
        athlete: { id: athleteId, username }
      }
    } = await axios.post(`https://www.strava.com/oauth/token`, {
      client_id: process.env.USER_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: authCodeFromStrava,
      grant_type: "authorization_code"
    });

    const authBearer = `${token_type} ${access_token}`;
    const scopes = scope.split(",");
    const readAllScope = !!scopes.indexOf("activity:read_all");
    await upsertAccessToken({
      athleteId: athleteId,
      username: username,
      accessToken: authBearer,
      // Read Scope is currently required.
      readScope: true,
      readAllScope: readAllScope,
      // expires at is in seconds, sequelize requires ms
      expiresAt: expires_at * 1000
    });

    await upsertRefreshToken({
      athleteId: athleteId,
      refreshToken: refresh_token,
      readScope: true,
      readAllScope: readAllScope
    });

    // Save in Express Session
    session.athleteId = athleteId;
    session.save(() => {
      res.redirect("/");
    });
  }
);

export default authRouter;
