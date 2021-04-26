const bcrypt = require("bcryptjs");
const mysql = require("mysql");
const {
  GeneralError,
  MissingError,
  VarifyError,
} = require("../middlewares/error");

const userController = {
  login: async (req, res) => {
    console.log("middleware: login");
    const { username, password } = req.body;
    // 檢查空值
    if (!username || !password) throw MissingError;
    const connection = mysql.createConnection(res.locals.pool);
    const cmd = "select * from users where username=?";
    connection.query(cmd, username, async (err, result) => {
      if (err) {
        //console.log(err);
        throw new GeneralError(err);
      }
      if (!result[0]) throw VarifyError;
      // 確認 user 的密碼
      const validPassword = await bcrypt.compare(password, result[0].password);
      if (!validPassword) throw VarifyError;
      req.session.username = res.locals.username;
      return res.status(200).json({
        ok: 1,
      });
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
