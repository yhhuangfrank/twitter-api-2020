let currentUsers = {}; // - 儲存目前登入使用者
const { Public_Message } = require("../models");
const { getCurrentUserList } = require("../helpers/data-helper");
module.exports = (io) => {
  //第一步先監聽前端發送的訊息再透過伺服器廣播給所有人
  io.on("connection", function (socket) {
    /*監聽事件，這邊的send_message是從前端發送socket.emit('send_message', options)*/
    socket.on("send_message", async (data) => {
      console.log(data); // - 傳入使用者發送的訊息與個人資料

      //- 透過伺服器廣播給自己以外所有人，前端會用socket.on('receive_message')監聽後，再渲染畫面
      socket.broadcast.emit("receive_message", data);
      const { id } = data.author;
      const { time, message } = data;

      // - 將訊息存到 DB
      await Public_Message.create({
        UserId: id,
        time,
        message,
      });
    });

    // - user 加入聊天室
    socket.on("join_chat", (user) => {
      console.log("有人加入了");
      if (!user || !user.id || currentUsers[user.id]) return;

      // - 儲存至 currentUsers
      const newCurrentUsers = { ...currentUsers };
      newCurrentUsers[user.id] = user // - 加入新成員
      currentUsers = { ...newCurrentUsers };
      
      const currentUsersList = getCurrentUserList(currentUsers);
      console.log(currentUsersList);
      console.log(`目前有${currentUsersList.length}位在聊天室`);

      // - 回傳目前在線上的人列表
      io.emit("user_join", currentUsersList);
    });

    // - user 離開聊天室
    socket.on("leave_chat", (user) => {
      console.log("有人離開了");
      if (!user || !user.id || !currentUsers[user.id]) return;

      delete currentUsers[user.id];
      const currentUsersList = getCurrentUserList(currentUsers);

      console.log(`目前有${currentUsersList.length}位在聊天室`);
    });

    // - 離開 socket 連線
    socket.on("disconnect", () => console.log("user Diconnected", socket.id));
  });
};
