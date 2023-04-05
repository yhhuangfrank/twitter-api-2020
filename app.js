if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const passport = require("./config/passport");
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

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(routes);

require("./controllers/websocket-controller")(io);

// Pass Server to socket.io instead of expresss application function.
server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

module.exports = app;
