const boardDAO = require("./boardDAO");

async function createBoard(board) {
  await boardDAO.create(board);
}

async function selectBoard(id) {
  return await boardDAO.findOneById(id);
}

module.exports = {
  createBoard,
  selectBoard,
};
