const bcrypt = require("bcryptjs");
const mysql = require("mysql");
const {
  GeneralError,
  MissingError,
  VarifyError,
} = require("../middlewares/error");

const userController = {
  add: async (req, res) => {
    console.log("middleware: add tag");
    const { content } = req.body;
    // 檢查空值
    if (!content) throw MissingError;
    const connection = mysql.createConnection(res.locals.pool);
    connection.query(
      "insert into tags set ?",
      {
        content,
      },
      function (err, fields) {
        if (err) throw new GeneralError(err);
        return res.status(200).json({
          ok: 1,
          id: fields.insertId,
        });
      }
    );
  },

  delete: async (req, res) => {
    console.log("middleware: delete tag");
    const id = req.params.id;
    const connection = mysql.createConnection(res.locals.pool);
    connection.query(
      "delete from tags where id = ?",
      id,
      function (err, fields) {
        if (err) throw new GeneralError(err);
        if (!fields.affectedRows) throw new GeneralError("不存在該 tag");
        return res.status(200).json({
          ok: 1,
        });
      }
    );
  },

  update: async (req, res) => {
    console.log("middleware: update tag");
    const id = req.params.id;
    const { content } = req.body;
    const connection = mysql.createConnection(res.locals.pool);
    connection.query(
      "update tags set ? where id = ?",
      [
        {
          content,
        },
        id,
      ],
      function (err, fields) {
        if (err) throw new GeneralError(err);
        if (!fields.affectedRows) throw new GeneralError("不存在該 tag");
        return res.status(200).json({
          ok: 1,
        });
      }
    );
  },
};

module.exports = userController;
