const { boardModel, sequelize } = require("../../models");
const Op = require("sequelize").Op;
const {
  BadRequestError,
  ForbiddenError,
  BasicError,
  ConflictError,
} = require("../../modules/error");

async function create(board) {
  const newBoard = await boardModel
    .create(board)
    .then((obj) => {
      return obj.get();
    })
    .catch((error) => {
      console.log(error);
      throw new ConflictError("게시글 생성에 실패했습니다.");
    });

  return newBoard;
}

async function findOneById(id) {
  const t = await sequelize.transaction();

  const board = await boardModel.findByPk(id, { transaction: t }).then((obj) => {
    if (!obj) {
      throw new BadRequestError("게시글이 존재하지 않습니다.");
    }
    return obj.get();
  });

  board.viewCount++;
  await boardModel
    .update({ viewCount: board.viewCount }, { where: { id }, transaction: t })
    .catch(() => {
      t.rollback();
      throw new ConflictError("게시글 조회에 실패했습니다.");
    });

  const updatedBaord = board;
  return updatedBaord;
}

async function updateLike(userId, boardId) {
  const t = await sequelize.transaction();

  let boardExist = await boardModel
    .findByPk(boardId, {
      raw: true,
      transaction: t,
    })
    .then((obj) => {
      if (!obj) {
        throw new BadRequestError("게시글이 존재하지 않습니다.");
      }
      return obj.get();
    });

  //좋아요 전처리
  let board = boardExist;
  let likeListString = board.likeUserId;
  let likeListArr = [];
  if (likeListString == null || likeListString == "") {
    likeListString = "";
  } else {
    likeListArr = likeListString.split(",");
  }
  let likeFlag = true;

  //좋아요 취소
  for (let i = 0; i < likeListArr.length; i++) {
    if (likeListArr[i] == userId) {
      likeListArr.splice(i, 1);
      likeFlag = false;
      board.likeCount = board.likeCount - 1;
      break;
    }
  }

  //좋아요 등록
  if (likeFlag) {
    likeListArr.push(userId);
    board.likeCount = board.likeCount + 1;
  }
  likeListString = likeListArr.toString();
  board.likeUserId = likeListString;

  await boardModel
    .update(board, {
      where: { id: board.id },
      transaction: t,
    })
    .catch(() => {
      t.rollback();
      throw new ConflictError("좋아요 기능에 실패했습니다.");
    });

  return board;
}

async function destroy(boardId, userEmail) {
  const t = await sequelize.transaction();

  let board = await boardModel.findByPk(boardId, { raw: true }).then((obj) => {
    if (!obj) {
      throw new BadRequestError("게시글이 존재하지 않습니다.");
    }
    return obj.get();
  });

  if (board.userEmail != userEmail) {
    throw new ForbiddenError("게시글은 본인만 지울수있습니다.");
  }

  await boardModel
    .destroy({
      where: { id: boardId },
      transaction: t,
    })
    .then((num) => {
      if (num != 1) {
        t.rollback();
        throw new ConflictError("게시글 삭제 실패했습니다.");
      }
    });

  t.commit();
}

async function update(board) {
  try {
    await boardModel.update(board, { where: { id: board.id } });
  } catch (error) {
    throw new Error("update 에러");
  }
}
async function findAllByCreated(articleCnt, page) {
  return await boardModel.findAll({
    order: [["createdAt", "DESC"]],
    offset: articleCnt * (page - 1),
    limit: articleCnt,
    raw: true,
  });
}

async function findAllByViewCount(articleCnt, page) {
  return await boardModel.findAll({
    order: [["viewCount", "DESC"]],
    offset: articleCnt * (page - 1),
    limit: articleCnt,
    raw: true,
  });
}
async function findAllByLikeCount(articleCnt, page) {
  return await boardModel.findAll({
    order: [["likeCount", "DESC"]],
    offset: articleCnt * (page - 1),
    limit: articleCnt,
    raw: true,
  });
}

async function findAllForSearch(search) {
  return await boardModel.findAll({
    where: {
      title: {
        [Op.like]: "%" + search + "%",
      },
    },
    raw: true,
  });
}

async function findAllForHashTag(hashtag) {
  return await boardModel.findAll({
    where: {
      hashtag: {
        [Op.like]: "#" + hashtag + ",",
      },
    },
    raw: true,
  });
}

module.exports = {
  create,
  findOneById,
  updateLike,
  destroy,
  update,
  findAllByCreated,
  findAllByViewCount,
  findAllByLikeCount,
  findAllForSearch,
  findAllForHashTag,
};
