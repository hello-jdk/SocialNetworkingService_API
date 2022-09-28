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

module.exports = {
  createBoard,
  selectBoard,
  clickLike,
  deleteBoard,
  updateBoard,
};
