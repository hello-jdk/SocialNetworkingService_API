const router = require("express").Router();
const userController = require("./user/userController");
const boardController = require("./board/boardController");
const auth = require("../middleware/auth");

router.post("/users/signup", userController.signUp);
router.post("/users/login", userController.login);

router.post("/boards", auth.checkToken, boardController.create);
router.put("/boards", boardController.update);
router.delete("/boards", boardController.destroy);

router.get("/boards/:id", boardController.selectOne);
//router.get("/boards/list")

module.exports = { router };
