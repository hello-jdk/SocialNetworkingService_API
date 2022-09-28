const express = require("express");
const logger = require("morgan");
const app = express();
const { router } = require("./api/router");

app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

////Router
app.use("/api", router);

////Error Handler
const { StatusCodes, getReasonPhrase } = require("http-status-codes");

// error 서버로그용
const errorLogger = (err, req, res, next) => {
  if (!err?.isCustom) {
    console.error(err);
  }
  next(err);
};

// error response용
const errorResponser = (err, req, res, next) => {
  const { statusCode, message, isCustom } = err;
  if (isCustom) {
    res.status(statusCode).json({ message: message });
  } else {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
  }
  next();
};
app.use(errorLogger);
app.use(errorResponser);

const { sequelize } = require("./models");
sequelize.sync({ force: false, alter: true }).catch((error) => {
  console.error(error);
  process.exit(1);
});

module.exports = app;
