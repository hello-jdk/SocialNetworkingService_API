const boardSerivce = require("./boardService");
const { StatusCodes } = require("http-status-codes");

async function create(req, res, next) {
  const board = req.body;
  try {
    board.userEmail = board.user.email;
    delete board.user;

    await boardSerivce.createBoard(board);

    return res.status(StatusCodes.OK).json({ message: "board Created" });
  } catch (error) {
    next(error);
  }
}
async function selectOne(req, res, next) {
  const id = req.params.id;
  try {
    const board = await boardSerivce.selectBoard(id);
    return res.status(StatusCodes.OK).json(board);
  } catch (error) {
    next(error);
  }
}
async function clickLike(req, res, next) {
  const boardId = req.params.id;
  const userId = req.body.user.id;
  try {
    const board = await boardSerivce.clickLike(userId, boardId);
    return res.status(StatusCodes.OK).json(board);
  } catch (error) {
    next(error);
  }
}
async function update(req, res, next) {}
async function destroy(req, res, next) {}

module.exports = {
  selectOne,
  create,
  update,
  destroy,
  clickLike,
};
