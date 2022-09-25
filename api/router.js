const router = require("express").Router();
const userController = require("./user/userController");

router.post("/users/signup", userController.signUp);
//router.post("/users/login", userController.login);

module.exports = { router };
