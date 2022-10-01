const { boardModel, sequelize } = require("../../models");
const Op = require("sequelize").Op;
const { BadRequestError, ForbiddenError, BasicError } = require("../../modules/error");

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
  const boardExist = await boardModel.findByPk(id, { transaction: t });
  if (!boardExist) {
    throw new BadRequestError("게시글이 존재하지 않습니다.");
  }

  try {
    const board = boardExist;
    const viewCount = board.viewCount + 1;
    await boardModel.update({ viewCount }, { where: { id }, transaction: t });
    board.viewCount++;

    t.commit();
    const updatedBaord = board;
    return updatedBaord;
  } catch (error) {
    t.rollback();
    if (!error.isCustom) {
      throw new Error("findOneById 에러");
    }
  }
}

async function updateLike(userId, boardId) {
  const t = await sequelize.transaction();
  let boardExist = await boardModel.findByPk(boardId, { raw: true, transaction: t });
  if (!boardExist) {
    throw new BadRequestError("게시글이 존재하지 않습니다.");
  }

  try {
    let board = boardExist;
    let likeListString = board.likeUserId;
    let likeListArr = [];
    if (likeListString == null || likeListString == "") {
      likeListString = "";
    } else {
      likeListArr = likeListString.split(",");
    }
    let likeFlag = true;

    for (let i = 0; i < likeListArr.length; i++) {
      if (likeListArr[i] == userId) {
        likeListArr.splice(i, 1);
        likeFlag = false;
        board.likeCount = board.likeCount - 1;
        break;
      }
    }

    if (likeFlag) {
      likeListArr.push(userId);
      board.likeCount = board.likeCount + 1;
    }

    likeListString = likeListArr.toString();
    board.likeUserId = likeListString;

    await boardModel.update(board, {
      where: { id: board.id },
      transaction: t,
    });

    t.commit();
    return board;
  } catch (error) {
    t.rollback();
    throw new Error("updateLike 에러");
  }
}

async function destroy(boardId, userEmail) {
  const t = await sequelize.transaction();

  let boardExist = await boardModel.findByPk(boardId, { raw: true });
  if (!boardExist) {
    throw new BadRequestError("게시글이 존재하지 않습니다.");
  }

  const board = boardExist;
  const boardAthor = board.userEmail;
  if (boardAthor != userEmail) {
    throw new ForbiddenError("게시글은 본인만 지울수있습니다.");
  }

  try {
    ////게시글 제거
    const deletedRowNum = await boardModel.destroy({
      where: { id: boardId },
      transaction: t,
    });

    if (deletedRowNum != 1) {
      throw new BasicError("board destroy", "게시글이 존재하고 본인이지만 지워지지 않음", 500);
    }

    t.commit();
  } catch (error) {
    console.log(error.message);
    t.rollback();
    throw new Error("destroy 에러");
  }
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
