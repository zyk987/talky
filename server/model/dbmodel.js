var mongoose = require("mongoose");
var db = require("../config/db");

var Schema = mongoose.Schema;
//用户表
var UserSchema = new Schema({
  //用户名
  name: { type: String },
  //密码
  pwd: { type: String },
  //邮箱
  email: { type: String },
  //性别
  sex: { type: String, default: "asexual" },
  //生日
  birth: { type: Date },
  //电话
  phone: { type: Number },
  //介绍
  explain: { type: String },
  //头像地址
  imgurl: { type: String, default: "/user/user.png" },
  //注册时间
  time: { type: Date },
});

//好友表
var FriendSchema = new Schema({
  //用户id
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  //好友id
  friendId: { type: Schema.Types.ObjectId, ref: "User" },
  //好友状态(0已为好友，1被申请中，2申请好友)
  state: { type: String },
  //好友昵称
  markname: { type: String },
  //生成时间
  time: { type: Date },
  //最后通讯时间
  lastTime: { type: Date },
});

//一对一消息表
var MessageSchema = new Schema({
  //用户id
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  //好友id
  friendId: { type: Schema.Types.ObjectId, ref: "User" },
  //内容
  message: { type: String },
  //内容类别（0文字，1图片，2音频，3视频，4位置）
  types: { type: String },
  //发送时间
  time: { type: Date },
  //消息状态(0已读，1未读)
  state: { type: Number },
});

//群表
var GroupSchema = new Schema({
  //用户id
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  //群名称
  name: { type: String },
  //群头像
  imgurl: { type: String, default: "/group/group.png" },
  //创建时间
  time: { type: Date },
  //公告
  notice: { type: String },
});

//群成员表
var GroupUserSchema = new Schema({
  //群id
  groupId: { type: Schema.Types.ObjectId, ref: "Group" },
  //用户id
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  //群内名称
  name: { type: String },
  //未读消息数
  tip: { type: Number, default: 0 },
  //加入时间
  time: { type: Date },
  //最后通讯时间
  lastTime: { type: Date },
  //是否屏蔽群消息（0不屏蔽，1屏蔽）
  shield: { type: Number },
});

//群消息表
var GroupMsgSchema = new Schema({
  //群id
  groupId: { type: Schema.Types.ObjectId, ref: "Group" },
  //用户id
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  //内容
  message: { type: String },
  //内容类型（0文字，1图片，2音频）
  types: { type: String },
  //发送时间
  time: { type: Date },
});

module.exports = db.model("User", UserSchema);
module.exports = db.model("Friend", FriendSchema);
module.exports = db.model("Message", MessageSchema);
module.exports = db.model("Group", GroupSchema);
module.exports = db.model("GroupUser", GroupUserSchema);
module.exports = db.model("GroupMsg", GroupMsgSchema);
