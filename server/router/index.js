const express = require("express");
const router = express();

const {
  test,
  mailtest,
  userAdd,
  userJudge,
  signIn,
  tokenTest,
  searchUser,
  isFriend,
  userDetial,
  friendMarkName,
  userUpdate,
  applyFriend,
  updateFriendState,
  deleteFriend,
  getFriend,
  getLastMsg,
  unreadMsg,
  getGroup,
  getLastGroupMsg,
  updateGroupMsg,
  getFriendInfo,
  friendChat,
  buildGroup,
  addGroupMember,
  updateMsg,
  groupChat,
  groupDetial,
  getGroupMembers,
  updateGroupDetial,
  updateGroupUser,
  deleteGroupMember,
  deleteGroup,
} = require("../controller/api");

// 测试
router.route("/test").get(test);
// 邮箱测试
router.route("/mail").post(mailtest);

// 注册页面
router.route("/signup/add").post(userAdd); // 添加用户
router.route("/signup/judge").post(userJudge); // 查询用户是否存在

// 登录页面
router.route("/signin/match").post(signIn); // 登录验证
// router.route('/signin/tokentest').post(tokenTest);    // token测试

// 搜索页面
router.route("/search/user").post(searchUser); // 搜索用户
router.route("/search/isfriend").post(isFriend); // 判断是否为好友
router.route("/search/group").post(searchUser); // 搜索群
router.route("/search/isingroup").post(searchUser); // 判断是否在群内

// 用户详情页
router.route("/user/detial").post(userDetial); // 用户详情
router.route("/user/update").post(userUpdate); // 用户信息修改
router.route("/user/markname").post(friendMarkName); // 好友昵称修改

// 好友申请
router.route("/friend/applyfriend").post(applyFriend); // 好友申请
router.route("/friend/getfriendinfo").post(getFriendInfo); // 获取好友信息
router.route("/friend/updatefriendstate").post(updateFriendState); // 好友状态修改
router.route("/friend/deletefriend").post(deleteFriend); // 删除或拒绝好友

// 主页
router.route("/index/getfriend").post(getFriend); // 获取好友
router.route("/index/getlastmsg").post(getLastMsg); // 获取最后一条消息
router.route("/index/unreadmsg").post(unreadMsg); // 获取消息未读数
router.route("/index/updatemsg").post(updateMsg); // 好友消息标已读
router.route("/index/getgroup").post(getGroup); // 获取群
router.route("/index/getlastgroupmsg").post(getLastGroupMsg); // 获取群最后一条消息
router.route("/index/updategroupmsg").post(updateGroupMsg); // 群消息标已读

// 群页面
router.route("/group/buildgroup").post(buildGroup); // 新建群
router.route("/group/deletegroup").post(deleteGroup); // 删除群
router.route("/group/addgroupmember").post(addGroupMember); // 添加群成员
router.route("/group/deletegroupmember").post(deleteGroupMember); // 删除群成员
router.route("/group/groupdetial").post(groupDetial); // 获取群详情
router.route("/group/groupmembers").post(getGroupMembers); // 获取群成员
router.route("/group/updategroupdetial").post(updateGroupDetial); // 修改群信息
router.route("/group/updategroupuser").post(updateGroupUser); // 修改群信息

// 聊天页
router.route("/chat/friendchat").post(friendChat); // 获取聊天数据
router.route("/chat/groupchat").post(groupChat); // 获取聊天数据

module.exports = router;
