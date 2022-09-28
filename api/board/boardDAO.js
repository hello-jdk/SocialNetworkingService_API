const { boardModel, hashTagModel, sequelize } = require("../../models");
const hashtagModel = require("../../models/hashtagModel");
const { BadRequestError, ForbiddenError, BasicError } = require("../../modules/error");

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
    ////해시태그 제거
    //게시글에 있는 해시태그 데이터
    const boardHashTagString = board.hashTag;
    const boardHashTagArr = boardHashTagString.split(",");

    //해시태그 이름으로 찾기
    for (const hashTagName of boardHashTagArr) {
      const hashTagRow = await hashTagModel.findOne({
        where: { name: hashTagName },
        transaction: t,
        raw: true,
      });

      //해당 해시태그 데이터에서 게시글 제거
      const hashTagboardIdString = hashTagRow.boardId;
      const hashTagboardIdArr = hashTagboardIdString.split(",");

      const updatedHashTagBaordId = await hashTagboardIdArr
        .filter((targetId) => targetId != boardId)
        .toString();

      if (updatedHashTagBaordId == "") {
        await hashTagModel.destroy({
          where: { id: hashTagRow.id },
          transaction: t,
        });
      } else {
        await hashTagModel.update(
          { boardId: updatedHashTagBaordId },
          {
            where: { id: hashTagRow.id },
            transaction: t,
          }
        );
      }
    }

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

module.exports = {
  create,
  findOneById,
  updateLike,
  destroy,
};
