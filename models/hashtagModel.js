const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  //모델 생성
  const HashTag = sequelize.define(
    //name
    "HashTag",
    //attribute
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      boardId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    //option
    { charset: "utf8mb4", collate: "utf8mb4_general_ci", freezeTableName: true }
  );

  return HashTag;
};
