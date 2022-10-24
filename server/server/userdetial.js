const dbserver = require("../dao/dbserver");

//用户详情
exports.userDetial = function (req, res) {
  let id = req.body.id;
  dbserver.userDetial(id, res);
};

//用户信息修改
exports.userUpdate = function (req, res) {
  let data = req.body;
  dbserver.userUpdate(data, res);
};

//修改好友昵称
exports.friendMarkName = function (req, res) {
  let data = req.body;
  dbserver.friendMarkName(data, res);
};
