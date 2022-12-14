const router = require("express").Router();
const userController = require("./user/userController");
const boardController = require("./board/boardController");
const auth = require("../middleware/auth");

router.post("/users/signup", userController.signUp);
router.post("/users/login", userController.login);

router.post("/boards", auth.checkToken, boardController.create);
router.get("/boards/:id", boardController.selectOne);
router.get("/boards/:id/:heart", auth.checkToken, boardController.clickLike);
router.put("/boards", auth.checkToken, boardController.update);
router.delete("/boards/:id", auth.checkToken, boardController.destroy);

router.get("/boards", boardController.selectAll);

module.exports = { router };
