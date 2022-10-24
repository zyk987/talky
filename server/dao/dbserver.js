const bcrypt = require("../dao/bcrypt");
const jwt = require("../dao/jwt");
const dbmodel = require("../model/dbmodel");
const User = dbmodel.model("User");
const Friend = dbmodel.model("Friend");
const Message = dbmodel.model("Message");
const Group = dbmodel.model("Group");
const GroupUser = dbmodel.model("GroupUser");
const GroupMsg = dbmodel.model("GroupMsg");

// 注册用户
exports.buildUser = function (name, mail, pwd, res) {
  let password = bcrypt.encryption(pwd);
  let data = {
    name: name,
    email: mail,
    pwd: password,
    time: new Date(),
  };
  let user = new User(data);

  user.save(function (err, result) {
    if (err) {
      res.send({ status: 500, msg: "用户注册失败！" });
    } else {
      res.send({ status: 200, msg: "用户注册成功！" });
    }
  });
};

// 匹配用户表元素个数
exports.countUserValue = function (data, type, res) {
  let wherestr = {};
  wherestr[type] = data;
  User.countDocuments(wherestr, function (err, result) {
    if (err) {
      res.status(500);
    } else {
      res.send({ status: 200, result });
    }
  });
};

// 用户验证
exports.userMatch = function (data, pwd, res) {
  let wherestr = { $or: [{ name: data }, { email: data }] };
  let out = { name: 1, imgurl: 1, pwd: 1 };
  User.find(wherestr, out, function (err, result) {
    if (err) {
      res.send({ status: 500 });
    } else {
      if (result == "") {
        res.send({ status: 400, msg: "用户不存在！" });
      }
      result.map((e) => {
        const pwdMatch = bcrypt.verification(pwd, e.pwd);
        if (pwdMatch) {
          let token = jwt.generateToken(e._id);
          let data = {
            id: e._id,
            name: e.name,
            imgurl: e.imgurl,
            token: token,
          };
          res.send({ status: 200, data });
        } else {
          res.send({ status: 400, msg: "用户密码错误！" });
        }
      });
    }
  });
};

// 搜索用户
exports.searchUser = function (data, res) {
  let wherestr;
  if (data == "talky") {
    wherestr = {};
  } else {
    wherestr = {
      $or: [{ name: { $regex: data } }, { email: { $regex: data } }],
    };
  }
  let out = {
    name: 1,
    email: 1,
    imgurl: 1,
  };
  User.find(wherestr, out, function (err, result) {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200, result });
    }
  });
};

// 判断是否为好友
exports.isFriend = function (uid, fid, res) {
  let wherestr = { userId: uid, friendId: fid, state: 0 };
  Friend.findOne(wherestr, function (err, result) {
    if (err) {
      res.send({ status: 500 });
    } else {
      if (result) {
        res.send({ status: 200 });
      } else {
        res.send({ status: 400 });
      }
    }
  });
};

// 获取好友信息
exports.getFriendInfo = function (uid, fid, res) {
  let wherestr = { userId: uid, friendId: fid };
  Friend.findOne(wherestr, function (err, result) {
    if (err) {
      res.send({ status: 500 });
    } else {
      if (result) {
        res.send({ status: 200, result });
      } else {
        res.send({ status: 400 });
      }
    }
  });
};
// 搜索群
exports.searchGroup = function (data, res) {
  let wherestr;
  if (data == "talky") {
    wherestr = {};
  } else {
    wherestr = { name: { $regex: data } };
  }
  let out = {
    name: 1,
    imgurl: 1,
  };
  Group.find(wherestr, out, function (err, result) {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200 }, result);
    }
  });
};

// 判断是否在群内
exports.isInGroup = function (uid, gid, res) {
  let wherestr = { userId: uid, groupId: gid };
  GroupUser.findOne(wherestr, function (err, result) {
    if (err) {
      res.send({ status: 500 });
    } else {
      if (result) {
        // 在群内
        res.send({ status: 200 });
      } else {
        // 不在群内
        res.send({ status: 400 });
      }
    }
  });
};

// 用户详情
exports.userDetial = function (id, res) {
  let wherestr = { _id: id };
  let out = { pwd: 0 };
  User.findOne(wherestr, out, function (err, result) {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200, result });
    }
  });
};

// 用户信息修改
function update(data, update, res) {
  User.findByIdAndUpdate(data, update, function (err, resu) {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200 });
    }
  });
}

exports.userUpdate = function (data, res) {
  let updatestr = {};
  // 判断是否有密码
  if (data.pwd != "undefined") {
    // console.log(data);
    // 进行密码匹配
    User.find({ _id: data.id }, { pwd: 1 }, function (err, result) {
      if (err) {
        res.send({ status: 500 });
      } else {
        if (result == "") {
          res.send({ status: 400, msg: "用户不存在！" });
        }
        result.map((e) => {
          const pwdMatch = bcrypt.verification(data.pwd, e.pwd);
          if (pwdMatch) {
            if (data.type == "pwd") {
              let password = bcrypt.encryption(data.data);
              updatestr[data.type] = password;
              update(data.id, updatestr, res);
            } else {
              // 邮箱匹配
              updatestr[data.type] = data.data;
              User.countDocuments(updatestr, function (err, result) {
                if (err) {
                  res.send({ status: 500 });
                } else {
                  if (result == 0) {
                    // 没有匹配项
                    update(data.id, updatestr, res);
                  } else {
                    // 已存在
                    res.send({ status: 400, msg: "邮箱已存在！" });
                  }
                }
              });
            }
          } else {
            res.send({ status: 400, msg: "密码错误！" });
          }
        });
      }
    });
  } else if (data.type == "name") {
    // 如果是用户名先进行匹配
    updatestr[data.type] = data.data;
    User.countDocuments(updatestr, function (err, result) {
      if (err) {
        res.status(500);
      } else {
        if (result == 0) {
          // 没有匹配项
          update(data.id, updatestr, res);
        } else {
          // 已存在
          res.send({ status: 400, msg: "用户名已存在！" });
        }
      }
    });
  } else {
    // 一般项修改
    updatestr[data.type] = data.data;
    update(data.id, updatestr, res);
  }
};

// 修改好友昵称
exports.friendMarkName = function (data, res) {
  let wherestr = { userId: data.uid, friendId: data.fid };
  let updatestr = { markname: data.name };

  Friend.updateOne(wherestr, updatestr, function (err, result) {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200 });
    }
  });
};

// 好友操作
// 添加好友表
exports.buildFriend = function (uid, fid, state, res) {
  let data = {
    userId: uid,
    friendId: fid,
    state: state,
    time: new Date(),
    lastTime: new Date(),
  };
  let friend = new Friend(data);

  friend.save(function (err, result) {
    if (err) {
      console.log("申请好友表出错");
    } else {
      // res.send({ status: 200 });
    }
  });
};

// 好友最后通讯时间
exports.upFriendLastTime = function (data, res) {
  let wherestr = {
    $or: [
      { userId: data.uid, friendId: data.fid },
      { userId: data.fid, friendId: data.uid },
    ],
  };
  let updatestr = { lastTime: new Date() };

  Friend.updateMany(wherestr, updatestr, function (err, result) {
    if (err) {
      console.log("更新最后通讯时间出错");
    } else {
      // res.send({ status: 200 });
    }
  });
};

// 添加一对一消息
exports.insertMsg = function (uid, fid, msg, type, res) {
  let data = {
    userId: uid,
    friendId: fid,
    message: msg,
    types: type,
    time: new Date(),
    state: 1,
  };
  let message = new Message(data);
  message.save(function (err, result) {
    if (err) {
      if (res) {
        res.send({ status: 500 });
      }
    } else {
      if (res) {
        res.send({ status: 200 });
      }
    }
  });
};

// 好友申请
exports.applyFriend = function (data, res) {
  // 判断是否已经申请过
  let wherestr = { userId: data.uid, friendId: data.fid };
  Friend.countDocuments(wherestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      if (result == 0) {
        this.buildFriend(data.uid, data.fid, 2);
        this.buildFriend(data.fid, data.uid, 1);
      } else {
        // 已经申请过好友
        this.upFriendLastTime(data);
      }
      // 添加消息
      this.insertMsg(data.uid, data.fid, data.msg, 0, res);
    }
  });
};

// 更新好友状态
exports.updateFriendState = function (data, res) {
  let wherestr = {
    $or: [
      { userId: data.uid, friendId: data.fid },
      { userId: data.fid, friendId: data.uid },
    ],
  };
  Friend.updateMany(wherestr, { state: 0 }, function (err, result) {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200 });
    }
  });
};

// 拒绝好友或拒绝好友
exports.deleteFriend = function (data, res) {
  let wherestr = {
    $or: [
      { userId: data.uid, friendId: data.fid },
      { userId: data.fid, friendId: data.uid },
    ],
  };
  Friend.deleteMany(wherestr, function (err) {
    if (err) {
      res.send({ status: 500 });
    } else {
      Message.deleteMany(wherestr, function (e) {
        if (e) {
          res.send({ status: 500 });
        } else {
          res.send({ status: 200 });
        }
      });
    }
  });
};

// 按需求获取用户列表
exports.getUsers = function (data, res) {
  let query = Friend.find({});
  // 查询条件
  query.where({ userId: data.uid, state: data.state });
  // 查询friendid关联的user对象
  query.populate("friendId");
  // 排序方式
  query.sort({ lastTime: -1 });
  // 查询结果
  query
    .exec()
    .then(function (e) {
      let result = e.map(function (ver) {
        return {
          id: ver.friendId._id,
          name: ver.friendId.name,
          markname: ver.markname,
          imgurl: ver.friendId.imgurl,
          lastTime: ver.lastTime,
          type: 0,
        };
      });
      res.send({ status: 200, result });
    })
    .catch(function (err) {
      res.send({ status: 500 });
    });
};

// 按要求获取一条一对一消息
exports.getOneMsg = function (data, res) {
  let query = Message.findOne({});
  // 查询条件
  query.where({
    $or: [
      { userId: data.uid, friendId: data.fid },
      { userId: data.fid, friendId: data.uid },
    ],
  });
  // 排序方式
  query.sort({ time: -1 });
  // 查询结果
  query
    .exec()
    .then(function (ver) {
      let result = {
        message: ver.message,
        time: ver.time,
        types: ver.types,
      };
      res.send({ status: 200, result });
    })
    .catch(function (err) {
      res.send({ status: 500 });
    });
};

// 汇总一对一消息未读数
exports.unreadMsg = function (data, res) {
  // 汇总条件
  let wherestr = {
    userId: data.fid,
    friendId: data.uid,
    state: 1,
  };
  Message.countDocuments(wherestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200, result });
    }
  });
};

// 一对一消息状态修改
exports.updateMsg = function (data, res) {
  // 修改条件
  let wherestr = {
    userId: data.fid,
    friendId: data.uid,
    state: 1,
  };
  // 修改内容
  let updatestr = {
    state: 0,
  };
  Message.updateMany(wherestr, updatestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200 });
    }
  });
};
// 新建群
exports.buildGroup = function (data, res) {
  let groupDate = {
    userId: data.uid,
    name: data.name,
    imgurl: data.imgurl,
    time: new Date(),
  };
  let group = new Group(groupDate);
  group.save(function (err) {
    if (err) {
      res.send({ status: 500 });
    } else {
      Group.find(
        { userId: data.uid, name: data.name },
        { _id: 1 },
        function (err, rest) {
          if (err) {
            res.send({ status: 500 });
          } else {
            // 添加群成员到群
            rest.map(function (gid) {
              let addArr = [];
              let udata = {
                groupId: gid._id,
                userId: data.uid,
                time: new Date(),
                lastTime: new Date(),
              };
              addArr.push(udata);
              // 添加好友入群
              let userArr = data.member.split(",");
              for (let i = 0; i < userArr.length; i++) {
                let fdata = {
                  groupId: gid._id,
                  userId: userArr[i],
                  time: new Date(),
                  lastTime: new Date(),
                };
                addArr.push(fdata);
              }
              GroupUser.insertMany(addArr, function (err) {
                if (err) {
                  res.send({ status: 500 });
                } else {
                  res.send({ status: 200 });
                }
              });
              // 添加第一条消息
              let groupMsg = {
                groupId: gid._id,
                userId: data.uid,
                message: "群已建立，一起来聊天吧~",
                types: 0,
                time: new Date(),
              };
              GroupMsg.insertMany(groupMsg);
            });
          }
        }
      );
    }
  });
};
// 删除群
exports.deleteGroup = function (data, res) {
  let wherestr = {
    _id: data.gid,
  };
  Group.deleteOne(wherestr, function (err) {
    if (err) {
    } else {
      GroupUser.deleteMany({ groupId: data.gid }, function (e) {
        if (e) {
          res.send({ status: 500 });
        } else {
          res.send({ status: 200 });
        }
      });
    }
  });
};
// 添加群成员
exports.addGroupMember = function (gid, uid, res) {
  let userArr = uid.split(",");
  let addArr = [];
  for (let i = 0; i < userArr.length; i++) {
    let fdata = {
      groupId: gid,
      userId: userArr[i],
      time: new Date(),
      lastTime: new Date(),
    };
    addArr.push(fdata);
  }
  GroupUser.insertMany(addArr, function (err, result) {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200 });
    }
  });
};
// 删除群成员
exports.deleteGroupMember = function (data, res) {
  let wherestr = {
    groupId: data.gid,
    userId: data.uid,
  };
  GroupUser.deleteOne(wherestr, function (err, result) {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200 });
    }
  });
};
// 群详情
exports.groupDetial = function (gid, res) {
  let wherestr = { _id: gid };
  let out = {};
  Group.findOne(wherestr, out, function (err, result) {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200, result });
    }
  });
};
// 群信息修改
exports.updateGroupDetial = function (data, res) {
  let updatestr = {};
  updatestr[data.type] = data.data;
  Group.findByIdAndUpdate(data.id, updatestr, function (err, resu) {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200 });
    }
  });
};
// 群内用户修改
exports.updateGroupUser = function (data, res) {
  let wherestr = { groupId: gid, userId: uid };
  let updatestr = {};
  updatestr[data.type] = data.data;
  GroupUser.updateOne(wherestr, updatestr, function (err, result) {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200 });
    }
  });
};
// 群成员
exports.getGroupMembers = function (gid, res) {
  let query = GroupUser.find({});
  // 查询条件
  query.where({ groupId: gid });
  // 查询userid关联的user对象
  query.populate("userId");
  // 查询结果
  query
    .exec()
    .then(function (e) {
      let result = e.map(function (ver) {
        return {
          id: ver.userId._id,
          markname: ver.name,
          name: ver.userId.name,
          imgurl: ver.userId.imgurl,
        };
      });
      res.send({ status: 200, result });
    })
    .catch(function (err) {
      res.send({ status: 500 });
    });
};
// 获取用户加入的群列表
exports.getGroup = function (uid, res) {
  let query = GroupUser.find({});
  // 查询条件
  query.where({ userId: uid });
  // 查询groupid关联的group对象
  query.populate("groupId");
  // 排序方式
  query.sort({ lastTime: -1 });
  // 查询结果
  query
    .exec()
    .then(function (e) {
      let result = e.map(function (ver) {
        return {
          id: ver.groupId._id,
          name: ver.groupId.name,
          markname: ver.name,
          imgurl: ver.groupId.imgurl,
          lastTime: ver.lastTime,
          tip: ver.tip,
        };
      });
      res.send({ status: 200, result });
    })
    .catch(function (err) {
      res.send({ status: 500 });
    });
};
// 添加群聊消息
exports.inserGrouptMsg = function (data, res) {
  let groupMsgData = {
    groupId: data.gid,
    userId: data.uid,
    message: data.msg,
    types: data.type,
    time: new Date(),
  };
  let groupMsg = new GroupMsg(groupMsgData);
  groupMsg.save(function (err, result) {
    if (err) {
      if (res) {
        res.send({ status: 500 });
      }
    } else {
      GroupUser.updateOne(
        { groupId: data.gid, userId: { $ne: data.uid } },
        { $inc: { tip: 1 } },
        () => {}
      );
      if (res) {
        res.send({ status: 200 });
      }
    }
  });
};
// 获取群最后一条消息
exports.getLastGroupMsg = function (gid, res) {
  let query = GroupMsg.findOne({});
  // 查询条件
  query.where({ groupId: gid });
  // 关联的user对象
  query.populate("userId");
  // 排序方式
  query.sort({ time: -1 });
  // 查询结果
  query
    .exec()
    .then(function (ver) {
      let result = {
        message: ver.message,
        time: ver.time,
        types: ver.types,
        name: ver.userId.name,
      };
      res.send({ status: 200, result });
    })
    .catch(function (err) {
      res.send({ status: 500 });
    });
};

// 群消息状态修改
exports.updateGroupMsg = function (data, res) {
  // 修改条件
  let wherestr = {
    userId: data.uid,
    groupId: data.gid,
  };
  // 修改内容
  let updatestr = {
    tip: 0,
  };
  GroupUser.updateOne(wherestr, updatestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200 });
    }
  });
};

// 分页获取一对一聊天数据
exports.friendChat = function (data, res) {
  let skipNum = data.currentPage * data.pageSize; // 跳过的条数
  // uid,fid,currentPage,pageSize
  let query = Message.find({});
  // 查询条件
  query.where({
    $or: [
      { userId: data.uid, friendId: data.fid },
      { userId: data.fid, friendId: data.uid },
    ],
  });
  // 查询friendid关联的user对象
  query.populate("userId");
  query.sort({ time: -1 });
  // 跳过条数
  query.skip(skipNum);
  // 每页条数
  query.limit(data.pageSize * 1);
  // 查询结果
  query
    .exec()
    .then(function (e) {
      let result = e.map(function (ver) {
        return {
          id: ver._id,
          message: ver.message,
          types: ver.types,
          time: ver.time,
          fromId: ver.userId._id,
          imgurl: ver.userId.imgurl,
        };
      });
      res.send({ status: 200, result });
    })
    .catch(function (err) {
      console.log(err);
      res.send({ status: 500 });
    });
};
// 分页获取群聊天数据
exports.groupChat = function (data, res) {
  let skipNum = data.currentPage * data.pageSize; // 跳过的条数
  // uid,fid,currentPage,pageSize
  let query = GroupMsg.find({});
  // 查询条件
  query.where({ groupId: data.gid });
  // 查询friendid关联的user对象
  query.populate("userId");
  query.sort({ time: -1 });
  // 跳过条数
  query.skip(skipNum);
  // 每页条数
  query.limit(data.pageSize * 1);
  // 查询结果
  query
    .exec()
    .then(function (e) {
      let result = e.map(function (ver) {
        return {
          id: ver._id,
          message: ver.message,
          types: ver.types,
          time: ver.time,
          fromId: ver.userId._id,
          imgurl: ver.userId.imgurl,
        };
      });
      res.send({ status: 200, result });
    })
    .catch(function (err) {
      console.log(err);
      res.send({ status: 500 });
    });
};
