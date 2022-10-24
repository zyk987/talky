var mongoose = require("mongoose");
var db = mongoose.createConnection("mongodb://127.0.0.1:27017/talky", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.info("数据库连接成功！");
});

module.exports = db;
