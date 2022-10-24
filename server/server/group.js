const dbserver = require("../dao/dbserver");
// 新建群
exports.buildGroup = function (req, res) {
  let data = req.body;
  dbserver.buildGroup(data, res);
};
// 删除群
exports.deleteGroup = function (req, res) {
  let data = req.body;
  dbserver.deleteGroup(data, res);
};
// 添加群成员
exports.addGroupMember = function (req, res) {
  let gid = req.body.gid;
  let uid = req.body.uid;
  dbserver.addGroupMember(gid, uid, res);
};
// 删除群成员
exports.deleteGroupMember = function (req, res) {
  let data = req.body;
  dbserver.deleteGroupMember(data, res);
};
// 获取群详情
exports.groupDetial = function (req, res) {
  let gid = req.body.gid;
  dbserver.groupDetial(gid, res);
};
// 修改群详情
exports.updateGroupDetial = function (req, res) {
  let data = req.body;
  dbserver.updateGroupDetial(data, res);
};
// 修改群内用户信息
exports.updateGroupUser = function (req, res) {
  let data = req.body;
  dbserver.updateGroupUser(data, res);
};
// 获取群成员
exports.getGroupMembers = function (req, res) {
  let gid = req.body.gid;
  dbserver.getGroupMembers(gid, res);
};
