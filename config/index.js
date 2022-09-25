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

const JWT = {
  secretKey: process.env.JWT_SECRETKEY,
  option: {
    algorithm: "HS256",
    expiresIn: "30m",
    issuer: "jdk",
  },
  TOKEN_EXPIRED: -3,
  TOKEN_INVALID: -2,
};

module.exports = { SERVER, MYSQL, JWT };
