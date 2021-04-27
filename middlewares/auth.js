const { GeneralError } = require("../middlewares/error");

const checkAuth = (req, res, next) => {
  if (req.session.username) next();
  throw new GeneralError("請確認登入狀況");
};

module.exports = {
  checkAuth,
};
