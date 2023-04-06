"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Public_Message extends Model {
    static associate(models) {
      Public_Message.belongsTo(models.User, { foreignKey: "UserId" });
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
      tableName: "Public_Messages",
    }
  );
  return Public_Message;
};
