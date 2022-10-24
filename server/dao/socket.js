let dbserver = require("./dbserver");
module.exports = function (io) {
  let users = {};
  io.on("connection", (socket) => {
    //用户登录注册
    socket.on("login", (id) => {
      // console.log(socket.id);

      socket.name = id;
      users[id] = socket.id;
      socket.emit("login", socket.id);
    });

    //一对一消息发送
    socket.on("msg", (msg, fromid, toid) => {
      // console.log(msg);

      //更新好友最后通讯时间
      dbserver.upFriendLastTime({ uid: fromid, fid: toid });
      // console.log(msg);
      //存储一对一消息
      dbserver.insertMsg(fromid, toid, msg.message, msg.types);
      if (users[toid]) {
        socket.to(users[toid]).emit("msg", msg, fromid, 0);
      }
      socket.emit("msg", msg, toid, 1);
    });
    //用户离开
    socket.on("disconnecting", () => {
      // console.log(users);
      if (users.hasOwnProperty(socket.name)) {
        delete users[socket.name];
        // console.log(socket.id + "离开");
      }
    });

    //加入群
    socket.on("group", function (data) {
      socket.join(data);
    });

    //接收群消息
    socket.on("groupMsg", (msg, fromid, gid, name, img) => {
      dbserver.inserGrouptMsg({
        gid,
        uid: fromid,
        msg: msg.message,
        type: msg.types,
      });
      socket.to(gid).emit("groupmsg", msg, gid, name, img);
    });
  });
};
