var dbserver = require('../dao/dbserver');
var email = require('../dao/emailserver');
//用户注册
exports.signUp = function (req, res) {
    let name = req.body.name;
    let mail = req.body.mail;
    let pwd = req.body.pwd;
    // res.send({ name, mail, pwd });
    //发送邮件
    email.emailSignUp(mail);
    dbserver.buildUser(name, mail, pwd, res);
}

//用户是否存在判断
exports.judgeValue = function (req, res) {
    let data = req.body.data;
    let type = req.body.type;
    // res.send({ data, type });
    dbserver.countUserValue(data, type, res);
}