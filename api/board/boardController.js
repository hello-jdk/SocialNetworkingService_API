const boardSerivce = require("./boardService");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../../modules/error");

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
async function update(req, res, next) {
  try {
    const { id, userEmail, title, contents, hashTag } = req.body;
    const board = {
      id: id,
      userEmail: userEmail,
      title: title,
      contents: contents,
      hashTag: hashTag,
    };
    const user = req.body.user;

    if (userEmail != user.email) {
      throw new BadRequestError("본인만 수정할수있습니다.");
    }

    await boardSerivce.updateBoard(board, user);
    return res.status(StatusCodes.OK).json({ message: "board Updated" });
  } catch (error) {
    next(error);
  }
}
async function destroy(req, res, next) {
  try {
    const boardId = req.params.id;

    const user = req.body.user;
    const userEmail = user?.email;

    await boardSerivce.deleteBoard(boardId, userEmail);
    return res.status(StatusCodes.OK).json({ message: "board Deleted" });
  } catch (error) {
    next(error);
  }
}

async function selectAll(req, res, next) {
  const orderby = req.query.orderby || "작성일";
  const articleCnt = Number(req.query.articleCnt) || 10;
  const page = Number(req.query.page) || 1;
  const search = req.query.search || false;
  const hashtag = req.query.hashtag || false;

  try {
    const data = await boardSerivce.selectAllBoards(orderby, articleCnt, page, search, hashtag);
    return res.status(StatusCodes.OK).json(data);
  } catch (error) {
    next(error);
  }

  console.log(orderby, articleCnt, page, search, hashtag);
}

module.exports = {
  selectOne,
  create,
  update,
  destroy,
  clickLike,
  selectAll,
};
