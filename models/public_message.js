"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Public_Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Public_Message.init(
    {
      UserId: DataTypes.INTEGER,
      message: DataTypes.STRING,
      time: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Public_Message",
      tableName: "Public_Messages"
    }
  );
  return Public_Message;
};
