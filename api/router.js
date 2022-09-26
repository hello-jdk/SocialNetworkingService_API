const router = require("express").Router();
const userController = require("./user/userController");
const boardController = require("./board/boardController");

router.post("/users/signup", userController.signUp);
router.post("/users/login", userController.login);

router.get("/boards/:id", userController.selectOne);
router.post("/boards", userController.create);
router.put("/boards", userController.update);
router.delete("/boards", userController.delete);
//router.get("/boards/list")

module.exports = { router };
