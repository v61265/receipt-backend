const { GeneralError, MissingError } = require("../middlewares/error");
const { getQueryPromise, conn } = require("../middlewares/query");

const tagController = {
  add: async (req, res) => {
    console.log("middleware: add tag");
    // 檢查空值
    const { content } = req.body;
    if (!content) throw MissingError;
    // 新增
    const result = await getQueryPromise(`insert into tags set ?`, [
      { content },
    ]);
    return res.status(200).json({
      ok: 1,
      id: result.insertId,
    });
  },

  delete: async (req, res) => {
    console.log("middleware: delete tag");
    const id = req.params.id;
    await conn.beginTransaction();
    // 刪除
    const result = await getQueryPromise(`delete from tags where id = ?`, [id]);
    if (!result.affectedRows) throw new GeneralError("不存在該 tag");
    // 將擁有該 tag 的發票的 iagId 清空
    const updateReceipt = await getQueryPromise(
      `update receipts set ? where tagId = ?`,
      [{ tagId: null }, id]
    );
    await conn.commit();
    return res.status(200).json({
      ok: 1,
    });
  },

  update: async (req, res) => {
    console.log("middleware: update tag");
    const id = req.params.id;
    const { content } = req.body;
    const result = await getQueryPromise(`update tags set ? where id = ?`, [
      {
        content,
      },
      id,
    ]);
    if (!result.affectedRows) throw new GeneralError("不存在該 tag");
    return res.status(200).json({
      ok: 1,
    });
  },

  getTags: async (req, res) => {
    console.log("middleware: get Tags");
    const tags = await getQueryPromise(`select * from tags`, []);
    return res.status(200).json({
      ok: 1,
      tags,
    });
  },
};

module.exports = tagController;
