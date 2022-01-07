require("dotenv").config({ path: require("path").resolve("configs/dotenv/.env") });

module.exports = {
  development: {
    username: process.env.PG_USER,
    password: process.env.PG_PASS,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    dialect: "postgres"
  },
  test: {
    username: process.env.PG_USER,
    password: process.env.PG_PASS,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    dialect: "postgres"
  },
  production: {
    username: process.env.PG_USER,
    password: process.env.PG_PASS,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    dialect: "postgres"
  }
};
