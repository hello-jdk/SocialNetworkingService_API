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

  if (search) {
    // 제목검색
    boards = await boardDAO.findAllForSearch(search);
  }

  if (!search) {
    // 제목x 해시태그o
    boards = await boardDAO.findAllForHashTag(hashtag);
  } else if (hashtag) {
    // 제목o 해시태그o
    let containedHashTagBoards = [];
    for (let board of boards) {
      if (board.hashTag.includes(hashtag + ",")) {
        containedHashTagBoards.push(board);
      }
    }
    boards = containedHashTagBoards;
  }

  if (!search && !hashtag) {
    // 제목x 해시태그x
    if (orderby == "작성일") {
      boards = await boardDAO.findAllByCreated(articleCnt, page);
    } else if (orderby == "조회수") {
      boards = await boardDAO.findAllByViewCount(articleCnt, page);
    } else if (orderby == "좋아요수") {
      boards = await boardDAO.findAllByLikeCount(articleCnt, page);
    } else {
      throw new BadRequestError("정렬값이 올바르지 않습니다.");
    }
  } else {
    // 제목or해시태그 o
    if (orderby == "작성일") {
      boards.sort((a, b) => {
        return b.createdAt - a.createdAt;
      });
    } else if (orderby == "조회수") {
      boards.sort((a, b) => {
        return b.viewCount - a.viewCount;
      });
    } else if (orderby == "좋아요수") {
      boards.sort((a, b) => {
        return b.likeCount - a.likeCount;
      });
    } else {
      throw new BadRequestError("정렬값이 올바르지 않습니다.");
    }
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
