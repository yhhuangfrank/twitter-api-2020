if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const passport = require("./config/passport");
const helpers = require("./helpers/auth-helper");
const routes = require("./routes/index");

const app = express();
// Pass Server to socket.io instead of expresss application function.
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const port = process.env.PORT || 3000;

// use helpers.getUser(req) to replace req.user
// function authenticated(req, res, next){
//   // passport.authenticate('jwt', { ses...
// };
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(routes);

//第一步先監聽前端發送的訊息再透過伺服器廣播給所有人
io.on("connection", function (socket) {
  /*監聽事件，這邊的send_message是從前端發送socket.emit('send_message', options)*/
  socket.on("send_message", function (data) {
    console.log(data);
    // 透過伺服器廣播給所有人，前端會用socket.on('receive_message')監聽後，再渲染畫面
    io.emit("receive_message", data);
  });
});

// Pass Server to socket.io instead of expresss application function.
server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

module.exports = app;
