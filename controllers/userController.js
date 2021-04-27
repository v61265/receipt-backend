const bcrypt = require("bcryptjs");
const mysql = require("mysql");
const { MissingError, VarifyError } = require("../middlewares/error");
const { getQueryPromise } = require("../middlewares/query");

const userController = {
  login: async (req, res) => {
    console.log("middleware: login");
    // 檢查空值
    const { username, password } = req.body;
    if (!username || !password) throw MissingError;
    // 用 username 抓 user
    const user = await getQueryPromise(`select * from users where username=?`, [
      username,
    ]);
    if (user.length === 0) throw VarifyError;
    // 確認 user 的密碼
    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) throw VarifyError;
    // 成功 -> 設定 session
    req.session.username = username;
    return res.status(200).json({
      ok: 1,
    });
  },

  logout: async (req, res) => {
    req.session.destroy();
    return res.status(200).json({
      ok: 1,
    });
  },
};

module.exports = userController;
