const users = {}
const { Public_Message } = require('../models')
module.exports = (io) => {
  //第一步先監聽前端發送的訊息再透過伺服器廣播給所有人
  io.on("connection", function (socket) {
    /*監聽事件，這邊的send_message是從前端發送socket.emit('send_message', options)*/
    socket.on("send_message", async (data) => {
      console.log(data); // - 傳入 current user 的資料
      //- 透過伺服器廣播給自己以外所有人，前端會用socket.on('receive_message')監聽後，再渲染畫面
      socket.broadcast.emit("receive_message", data);
      const { id } = data.author
      const { time, message } = data
      // - 將訊息存到 DB
      await Public_Message.create({
        UserId: id,
        time,
        message
      })
    }); 
  });
};