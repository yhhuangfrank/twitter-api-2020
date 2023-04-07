const { User, Public_Message } = require("../models");

const messageController = {
  getPublicMessages: async (req, res, next) => {
    try {
      const messages = await Public_Message.findAll({
        include: [{ model: User, attributes: ["avatar"],  }],
        raw: true,
        nest: true,
      });
      const data = messages.map((m) => ({
        type: "message",
        author: {
          id: m.UserId,
          avatar: m.User.avatar,
        },
        message: m.message,
        time: m.time,
      }));
      return res.json(data);
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = messageController;
