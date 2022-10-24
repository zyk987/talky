var bcrypt = require("bcryptjs");

//加密
exports.encryption = function (e) {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(e, salt);
  return hash;
};

//解密
exports.verification = function (e, hash) {
  let verif = bcrypt.compareSync(e, hash);
  return verif;
};
