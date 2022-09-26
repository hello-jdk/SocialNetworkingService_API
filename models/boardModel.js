const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Board = sequelize.define(
    "Board",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contents: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hashTag: {
        type: DataTypes.STRING,
      },
      viewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    { charset: "utf8mb4", collate: "utf8mb4_general_ci", paranoid: true, freezeTableName: true }
  );

  return Board;
};
