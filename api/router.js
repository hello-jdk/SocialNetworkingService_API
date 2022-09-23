const router = require("express").Router();

router.get("/", (req, res, next) => {
  console.log("init");
});

module.exports = { router };
