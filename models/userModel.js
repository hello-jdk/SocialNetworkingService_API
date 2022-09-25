const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  //모델 생성
  const User = sequelize.define(
    //name
    "User",
    //attribute
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    //option
    { charset: "utf8mb4", collate: "utf8mb4_general_ci" }
  );

  return User;
};
