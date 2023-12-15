const path = require("path");
require("dotenv").config({ path: path.resolve("backend/configs/dotenv/.env") });
const { performance } = require("perf_hooks");
import "colors";
import express, { Request, Response } from "express";
// import redis = require("redis");
const next = require("next");
const cors = require("cors");

// Redis ->
const redis = require("redis");
const connectRedis = require("connect-redis");
import session = require("express-session");
const redisStore = connectRedis(session);
const redisClient = redis.createClient();

import dataRouter from "./dataRouter";
import authRouter from "./authRouter";
const dev = process.env.NODE_ENV !== "production";

const server = express();

// server.use(async (_, _x, next) => {
//   await app.prepare();
//   next();
// });

(() => {
  const app = next({ dev });
  const handle = app.getRequestHandler();
  console.log("\n\n\n\n" + handle);
  return app.prepare().then(() => {
    server.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true
      })
    );

    server.use(
      session({
        name: process.env.EXPRESS_SESSION_COOKIE_NAME,
        // @ts-ignore
        secret: process.env.EXPRESS_SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
          httpOnly: false,
          sameSite: "lax",
          secure: false
        },
        store: new redisStore({
          client: redisClient,
          disableTouch: true
        })
      })
    );

    server.use((req, _res, next) => {
      console.log(performance.now());
      console.log(
        //@ts-ignore
        `${req.method} ${req.url} ${req.session?.athleteId || "No Athlete Id"}`.blue
      );
      next();
    });

    server.use(/(exchange_token|authLink)?/, authRouter);

    server.use(
      /(loggedInUser|allEntries|individualEntry|addAllActivities|putActivityUpdate|destroy-user)?/,
      dataRouter
    );

    server.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });

    const port = 3000;
    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`Strava Report Generator Listening on port ${port}`);
    });
  });
})();
