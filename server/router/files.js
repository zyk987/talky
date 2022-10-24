const multer = require("multer");
const mkdir = require("../dao/mkdir");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let url = req.body.url;
    mkdir.mkdirs("../data/" + url, (err) => {
      console.log(err);
    });
    cb(null, "./data/" + url);
  },
  filename: function (req, file, cb) {
    let name = req.body.name;
    let type = file.originalname.replace(/.+\./, ".");
    cb(null, name + type);
  },
});

var upload = multer({ storage: storage });

module.exports = function (app) {
  //前端文件上传
  app.post(
    "/api/files/upload",
    upload.array("file", 12),
    function (req, res, next) {
      //获取文件信息
      let url = req.body.url;
      let name = req.files[0].filename;
      let imgurl = "/" + url + "/" + name;
      res.send(imgurl);
    }
  );
};
