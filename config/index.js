require("dotenv").config();

const SERVER = {
  PORT: process.env.PORT,
};

const MYSQL = {
  HOST: process.env.DB_HOST,
  DATABASE: process.env.DB_DATABASE,
  USERNAME: process.env.DB_USERNAME,
  PASSWORD: process.env.DB_PASSWORD,
  DIALECT: "mysql",
};

module.exports = { SERVER, MYSQL };
