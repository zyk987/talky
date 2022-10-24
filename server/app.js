const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const http = require("http");
const port = 3000;

const api = require("./router/index");
const jwt = require("./dao/jwt");

//socket.io
const io = require("socket.io")(5000);
require("./dao/socket")(io);

app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", "Express");
  res.header("Content-Type", "application/json;charset=utf-8");
  if (req.method == "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
//parse application/json
app.use(bodyParser.json());

app.use(express.static(__dirname + "/data"));

app.use(function (req, res, next) {
  if (typeof req.body.token != "undefined") {
    let token = req.body.token;
    let tokenMatch = jwt.verifyToken(token);
    if (tokenMatch == 1) {
      next();
    } else {
      res.send({ status: 300, msg: "token验证失败！" });
    }
  } else {
    next();
  }
});
require("./router/files")(app);
app.use("/api", api);

//404
app.use((req, res, next) => {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});
//出现错误处理
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
