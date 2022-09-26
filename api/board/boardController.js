const boardSerivce = require("./boardService");
const { StatusCodes } = require("http-status-codes");

async function create(req, res, next) {
  const board = req.body;
  try {
    await boardSerivce.createBoard(board);
    return res.status(StatusCodes.OK).json({ message: "board Created" });
  } catch (error) {
    next(error);
  }
}
async function update(req, res, next) {}
async function destroy(req, res, next) {}
async function selectOne(req, res, next) {
  console.log("selectOne");
}
async function checkLike(req, res, next) {
  console.log("heart");
}

module.exports = {
  selectOne,
  create,
  update,
  destroy,
  checkLike,
};
