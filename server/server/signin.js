const dbserver = require('../dao/dbserver');

const jwt = require('../dao/jwt');

exports.signIn = function (req, res) {
    let data = req.body.data;
    let pwd = req.body.pwd;

    dbserver.userMatch(data, pwd, res);
}

// exports.tokenTest = function (req, res) {
//     let token = req.body.token;
//     let jg = jwt.verifyToken(token);

//     res.send(jg);
// }