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

module.exports = {
  createBoard,
  selectBoard,
  clickLike,
};
