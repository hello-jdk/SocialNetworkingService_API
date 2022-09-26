const boardDAO = require("./boardDAO");

async function createBoard(board) {
  await boardDAO.create(board);
}

module.exports = { createBoard };
