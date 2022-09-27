const { boardModel, hashTagModel, sequelize } = require("../../models");
const { BadRequestError } = require("../../modules/error");

async function create(board) {
  //트랜잭션
  const t = await sequelize.transaction();
  try {
    //게시글 생성
    const newBoard = await boardModel.create(board, { transaction: t });

    //해시태그 생성 or 수정
    const hashTagArr = board.hashTag.split(",");

    for (let i = 0; i < hashTagArr.length; i++) {
      const [row, created] = await hashTagModel.findOrCreate({
        where: {
          name: hashTagArr[i],
        },
        defaults: {
          name: hashTagArr[i],
          boardId: newBoard.id,
        },
        transaction: t,
      });

      //기존에 있다면 게시글 추가
      if (!created) {
        const hashTagId = row.id;
        const hashTagboardId = row.boardId.concat(",", newBoard.id);

        await hashTagModel.update(
          { boardId: hashTagboardId },
          { where: { id: hashTagId }, transaction: t }
        );
      }
    }

    t.commit();
  } catch (error) {
    t.rollback();
    throw new Error("board create 에러");
  }
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

module.exports = {
  create,
  findOneById,
  updateLike,
};
