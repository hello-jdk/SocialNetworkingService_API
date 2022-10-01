const Sequelize = require("sequelize");
const { MYSQL, RDS } = require("../config");

const DB = "local";
let sequelize = {};

if (DB == "local") {
  ////MYSQL
  sequelize = new Sequelize(MYSQL.DATABASE, MYSQL.USERNAME, MYSQL.PASSWORD, {
    host: MYSQL.HOST,
    dialect: MYSQL.DIALECT,
    logging: true,
  });
} else {
  ////RDS
  sequelize = new Sequelize(RDS.DATABASE, RDS.USERNAME, RDS.PASSWORD, {
    host: RDS.HOST,
    port: RDS.PORT,
    dialect: RDS.DIALECT,
    logging: true,
  });
}

//모델 정의
const userModel = require("./userModel")(sequelize);
const boardModel = require("./boardModel")(sequelize);

//관계성 정의
Object.values(sequelize.models).forEach((model) => {
  if (model.associate) {
    model.associate(sequelize.models);
  }
});

module.exports = { sequelize, userModel, boardModel };
