const dbserver = require("../dao/dbserver");

//好友申请
exports.applyFriend = function (req, res) {
  let data = req.body;
  dbserver.applyFriend(data, res);
};

//获取好友信息
exports.getFriendInfo = function (req, res) {
  let uid = req.body.uid;
  let fid = req.body.fid;
  dbserver.getFriendInfo(uid, fid, res);
};
//好友状态更新
exports.updateFriendState = function (req, res) {
  let data = req.body;
  dbserver.updateFriendState(data, res);
};

//拒绝好友或者删除好友
exports.deleteFriend = function (req, res) {
  let data = req.body;
  dbserver.deleteFriend(data, res);
};
