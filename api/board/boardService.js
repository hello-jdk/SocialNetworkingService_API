const { BadRequestError } = require("../../modules/error");
const boardDAO = require("./boardDAO");

async function createBoard(board) {
  await boardDAO.create(board);
}

async function selectBoard(id) {
  return await boardDAO.findOneById(id);
}

async function clickLike(userId, boardId) {
  return await boardDAO.updateLike(userId, boardId);
}

async function deleteBoard(boardId, userEmail) {
  return await boardDAO.destroy(boardId, userEmail);
}

async function updateBoard(board) {
  return await boardDAO.update(board);
}

async function selectAllBoards(orderby, articleCnt, page, search, hashtag) {
  let boards = [];

  if (orderby == "작성일") {
    boards = await boardDAO.findeAllByCreated(articleCnt, page);
  } else if (orderby == "조회수") {
    boards = await boardDAO.findAllByViewCount(articleCnt, page);
  } else if (orderby == "좋아요수") {
    boards = await boardDAO.findeAllByLikeCount(articleCnt, page);
  } else {
    throw new BadRequestError("정렬값이 올바르지 않습니다.");
  }

  if (search) {
    let searchedBoards = [];
    for (let board of boards) {
      if (board.title.includes(search)) {
        searchedBoards.push(board);
      }
    }
    boards = searchedBoards;
  }

  if (hashtag) {
    let containHashTagBoards = [];
    for (let board of boards) {
      const hashTagArr = board.hashTag.split(",");
      for (let SearchedHashTag of hashTagArr) {
        if (SearchedHashTag == hashtag) {
          containHashTagBoards.push(board);
          break;
        }
      }
    }
    boards = containHashTagBoards;
  }

  return boards;
}

module.exports = {
  createBoard,
  selectBoard,
  clickLike,
  deleteBoard,
  updateBoard,
  selectAllBoards,
};
