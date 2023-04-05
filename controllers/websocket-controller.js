module.exports = (io) => {
  //第一步先監聽前端發送的訊息再透過伺服器廣播給所有人
  io.on("connection", function (socket) {
    /*監聽事件，這邊的send_message是從前端發送socket.emit('send_message', options)*/
    socket.on("send_message", function (data) {
      console.log(data);
      // 透過伺服器廣播給所有人，前端會用socket.on('receive_message')監聽後，再渲染畫面
      io.emit("receive_message", data);
    });
  });
};
