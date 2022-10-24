var nodemailer = require('nodemailer');
var credentials = require('../config/credentials');
//创建传输方式
var transporter = nodemailer.createTransport({
    service: 'qq',
    auth: {
        user: credentials.qq.user,
        pass: credentials.qq.pass,
    }
});

exports.emailSignUp = function (email, res) {
    //发送信息
    let options = {
        from: '2047403818@qq.com',
        to: email,
        subject: '感谢您注册！',
        html: '<span>欢迎您的加入</span><a href="http://localhost:8080/">点击</a>',
    }
    //发送邮件
    transporter.sendMail(options, function (err, msg) {
        if (err) {
            res.send('邮箱发送失败！');
            console.log(err);
        } else {
            res.send('邮箱发送成功！');
            console.log('邮箱发送成功！');
        }
    })
}