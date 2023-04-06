const { User, Public_Message } = require("../models");

const messageController = {
  getPublicMessages: async (req, res, next) => {
    try {
      const messages = await Public_Message.findAll({
        include: [{ model: User, attributes: ["avatar"], required: true }],
        raw: true,
        nest: true,
      });
      return res.json(messages);
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = messageController;
