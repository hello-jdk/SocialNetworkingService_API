const { boardModel, hashTagModel, sequelize } = require("../../models");

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
    throw Error("board create 에러");
  }
}

module.exports = { create };
