const path = require("path");
const redis = require("redis");
const connectRedis = require("connect-redis");
const session = require("express-session");

const redisStore = connectRedis(session);
const redisClient = redis.createClient();

require("dotenv").config({ path: path.resolve("backend/configs/dotenv/.env") });

const withSession = () => {
  return session({
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
  });
};

export default withSession;
