const signup = require("../server/signup");
const signin = require("../server/signin");
const search = require("../server/search");
const userdetial = require("../server/userdetial");
const friend = require("../server/friend");
const index = require("../server/index");
const chat = require("../server/chat");
const group = require("../server/group");
exports.test = (req, res) => {
  res.send("hello");
};
exports.mailtest = (req, res) => {
  let mail = req.body.mail;
  emailserver.emailSignUp(mail, res);
  res.send(mail);
};
// 注册页面
// 用户注册
exports.userAdd = (req, res) => {
  signup.signUp(req, res);
};
// 用户注册查询是否存在
exports.userJudge = (req, res) => {
  signup.judgeValue(req, res);
};

// 登录页面
// 登录
exports.signIn = (req, res) => {
  signin.signIn(req, res);
};
exports.tokenTest = (req, res) => {
  signin.tokenTest(req, res);
};

// 搜索页面
// 搜索用户
exports.searchUser = (req, res) => {
  search.searchUser(req, res);
};
// 判断是否为好友
exports.isFriend = (req, res) => {
  search.isFriend(req, res);
};
// 搜索群
exports.searchGroup = (req, res) => {
  search.searchGroup(req, res);
};
// 判断是否在群内
exports.isInGroup = (req, res) => {
  search.isInGroup(req, res);
};

// 用户详情页
// 用户详情获取
exports.userDetial = (req, res) => {
  userdetial.userDetial(req, res);
};
// 用户信息修改
exports.userUpdate = (req, res) => {
  userdetial.userUpdate(req, res);
};
// 好友昵称修改
exports.friendMarkName = (req, res) => {
  userdetial.friendMarkName(req, res);
};

// 好友申请
exports.applyFriend = (req, res) => {
  friend.applyFriend(req, res);
};
// 获取好友信息
exports.getFriendInfo = function (req, res) {
  friend.getFriendInfo(req, res);
};
// 更新好友状态
exports.updateFriendState = (req, res) => {
  friend.updateFriendState(req, res);
};
// 拒绝或删除好友
exports.deleteFriend = (req, res) => {
  friend.deleteFriend(req, res);
};

// 获取好友
exports.getFriend = (req, res) => {
  index.getFriend(req, res);
};

// 获取最后一条消息
exports.getLastMsg = (req, res) => {
  index.getLastMsg(req, res);
};

// 获取消息未读数
exports.unreadMsg = (req, res) => {
  index.unreadMsg(req, res);
};

// 好友消息标已读
exports.updateMsg = (req, res) => {
  index.updateMsg(req, res);
};
// 新建群
exports.buildGroup = (req, res) => {
  group.buildGroup(req, res);
};
// 删除群
exports.deleteGroup = (req, res) => {
  group.deleteGroup(req, res);
};
// 添加群成员
exports.addGroupMember = (req, res) => {
  group.addGroupMember(req, res);
};
// 删除群成员
exports.deleteGroupMember = (req, res) => {
  group.deleteGroupMember(req, res);
};
// 获取群
exports.getGroup = (req, res) => {
  index.getGroup(req, res);
};
// 群详情
exports.groupDetial = (req, res) => {
  group.groupDetial(req, res);
};
// 修改群详情
exports.updateGroupDetial = (req, res) => {
  group.updateGroupDetial(req, res);
};
// 修改群用户信息
exports.updateGroupUser = (req, res) => {
  group.updateGroupUser(req, res);
};
// 群成员
exports.getGroupMembers = (req, res) => {
  group.getGroupMembers(req, res);
};

// 获取群最后一条消息
exports.getLastGroupMsg = (req, res) => {
  index.getLastGroupMsg(req, res);
};

// 群消息标已读
exports.updateGroupMsg = (req, res) => {
  index.updateGroupMsg(req, res);
};

// 获取一对一聊天数据（分页）
exports.friendChat = (req, res) => {
  chat.friendChat(req, res);
};

// 获取群聊数据（分页）
exports.groupChat = (req, res) => {
  chat.groupChat(req, res);
};
