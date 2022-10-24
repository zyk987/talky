const dbserver = require("../dao/dbserver");

//获取一对一聊天数据
exports.friendChat = function (req, res) {
  let data = req.body;
  dbserver.friendChat(data, res);
};

//获取群聊聊天数据
exports.groupChat = function (req, res) {
  let data = req.body;
  dbserver.groupChat(data, res);
};
