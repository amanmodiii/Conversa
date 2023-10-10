const { Server } = require("socket.io");

const io = new Server({ cors: "https://conversa-chats.netlify.app/" });

let onlineUsers = [];
io.on("connection", (socket) => {
  console.log("New connection : ", socket.id);

  //listen to connection
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      userId !== null &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    io.emit("getOnlineUsers", onlineUsers);
  });

  //add message
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        sid: message.sid,
        isRead: false,
        date: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log("Online Users : ", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3000);
