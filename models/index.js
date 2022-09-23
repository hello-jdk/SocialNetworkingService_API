const Sequelize = require("sequelize");
const { MYSQL } = require("../config");

////MYSQL
const sequelize = new Sequelize(MYSQL.DATABASE, MYSQL.USERNAME, MYSQL.PASSWORD, {
  host: MYSQL.HOST,
  dialect: MYSQL.DIALECT,
  logging: false,
});

//모델 정의
//const defineUserModel = require("./userModel");
//const userModel = defineUserModel(sequelize);

//관계성 정의
Object.values(sequelize.models).forEach((model) => {
  if (model.associate) {
    model.associate(sequelize.models);
  }
});

module.exports = { sequelize };
