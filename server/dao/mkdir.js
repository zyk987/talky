const fs = require("fs");
const path = require("path");
exports.mkdirs = function (pathname, callback) {
  //判断是否为绝对路径
  pathname = path.isAbsolute(pathname)
    ? pathname
    : path.join(__dirname, pathname);
  pathname = path.relative(__dirname, pathname);
  let floders = pathname.split(path.sep);
  let pre = "";
  floders.forEach((floder) => {
    try {
      //没有异常，文件已经创建
      let _stat = fs.statSync(path.join(__dirname, pre, floder));
      let hasMkdir = _stat && _stat.isDirectory();
      if (hasMkdir) {
        callback; //文件已存在
      }
    } catch {
      try {
        fs.mkdirSync(path.join(__dirname, pre, floder));
        callback && callback(null);
      } catch (err) {
        callback && callback(err);
      }
    }
    pre = path.join(pre, floder);
  });
};
