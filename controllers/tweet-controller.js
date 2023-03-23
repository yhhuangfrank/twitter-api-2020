const { Tweet, User, Like, Reply, sequelize } = require("../models");
const { getUser } = require("../helpers/auth-helper");

const tweetController = {
  // 要取得所有貼文，每則貼文要拿到user的name跟account，還有每則貼文的按讚數/回覆數量，去關聯Like/Reply
  // 感覺要用raw SQL語法
  getTweets: async (req, res, next) => {
    try {
      const currentUserId = getUser(req).id;

      if (!currentUserId) {
        const err = new Error("找不到使用者");
        err.status = 404;
        throw err;
      }

      const tweets = await Tweet.findAll({
        nest: true,
        raw: true,
        include: [
          {
            model: User,
            attributes: ["id", "account", "name", "avatar"],
          },
        ],
        attributes: [
          "id",
          "description",
          "createdAt",
          // 計算每筆Tweet有幾個replies
          [
            sequelize.literal(
              "(SELECT COUNT(id) FROM Replies WHERE Replies.TweetId = Tweet.id)"
            ),
            "replyCounts",
          ],
          // 計算每筆Tweet有幾個likes
          [
            sequelize.literal(
              "(SELECT COUNT(id) FROM Likes WHERE Likes.TweetId = Tweet.id)"
            ),
            "likeCounts",
          ],
          // 找出每筆Tweet，目前登入的使用者是否有按讚，若 EXISTS 為真，就會繼續執行外查詢中的 SQL；若 EXISTS 為假，則整個 SQL 查詢就不會返回任何結果
          [
            sequelize.literal(
              `EXISTS (SELECT id FROM Likes WHERE Likes.TweetId = Tweet.id AND Likes.UserId = ${currentUserId})`
            ),
            "isLiked",
          ],
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.json({ status: "success", tweets });
    } catch (err) {
      return next(err);
    }
  },
  postTweet: async (req, res, next) => {
    const currentUserId = getUser(req).id;
    const description = req.body.description.trim();
    try {
      if (!description) {
        const error = new Error("內容不可空白");
        error.status = 400;
        throw error;
      }
      if (description.length > 140) {
        const err = new Error("字數不可超過140字");
        err.status = 400;
        throw err;
      }
      const tweetInput = await Tweet.create({
        UserId: currentUserId,
        description,
      });
      const user = await User.findByPk(currentUserId, {
        raw: true,
        nest: true,
        attributes: ["id", "avatar"],
      });
      return res.json({
        status: "success",
        tweetInput,
        user,
      });
    } catch (err) {
      return next(err);
    }
  },
  getTweet: async (req, res, next) => {
    // 要取得該筆貼文，並關聯user(取得user的資料)，及拿到likeCounts/replyCounts/isLiked
    try {
      const tweetId = req.params.tweet_id;
      const currentUserId = getUser(req).id;
      const tweet = await Tweet.findByPk(tweetId, {
        nest: true,
        raw: true,
        include: {
          model: User,
          attributes: ["id", "name", "account", "avatar"],
        },
        attributes: [
          "id",
          "description",
          "createdAt",
          [
            sequelize.literal(
              "(SELECT COUNT(id) FROM Replies WHERE Replies.TweetId = Tweet.id)"
            ),
            "replyCounts",
          ],
          [
            sequelize.literal(
              "(SELECT COUNT(id) FROM Likes WHERE Likes.TweetId = Tweet.id)"
            ),
            "likeCounts",
          ],
          [
            sequelize.literal(
              `EXISTS (SELECT id FROM Likes WHERE Likes.TweetId = Tweet.id AND Likes.UserId = ${currentUserId})`
            ),
            "isLiked",
          ],
        ],
        order: [["createdAt", "DESC"]],
      });
      if (!tweet) {
        const err = new Error("該貼文不存在");
        err.status = 404;
        throw err;
      }
      return res.json({
        status: "success",
        tweet,
      });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = tweetController;