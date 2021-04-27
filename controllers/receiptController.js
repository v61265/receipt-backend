const { GeneralError } = require("../middlewares/error");
const { getQueryPromise, conn } = require("../middlewares/query");

// 可回頭加強: transaction, userId
const userController = {
  add: async (req, res) => {
    console.log("middleware: add receipt");
    const tag = req.body.type;
    const inputText = req.files.file[0].buffer.toString();
    // 字串處理
    const template = /(((?<=Date:).+(?= ))|((?<=Time:).+(?=\r))|((?<=Receipt ID:).+(?= ))|CASH|MASTER|VISA|\d+(?= (x|[A-Za-z])))/g;
    const inputArr = inputText.match(template);
    const dateArr = inputArr[0].replace(" ", "").split(".").reverse();
    dateArr.push(...inputArr[1].split(":"));
    dateArr[1] -= 1;
    let itemArr = [];
    for (let i = 3; i < inputArr.length - 1; i += 2) {
      itemArr.push({
        serialNumber: inputArr[i],
        quantity: inputArr[i + 1],
      });
    }
    const inputObj = {
      time: new Date(...dateArr),
      serialNumber: inputArr[2].replace("  ", ""),
      items: itemArr,
      method: inputArr[inputArr.length - 1],
    };
    await conn.beginTransaction();
    // 檢查是否有該 tag -> 有的話留 id 沒有的話創建並記錄 id
    const tagId = await getQueryPromise(`select * from tags where ?`, [
      {
        content: tag,
      },
    ]).then(async (data) => {
      if (data[0]) return data[0].id;
      // 創立新 tag
      return await getQueryPromise(`insert into tags set ?`, [
        { content: tag },
      ]).then((result) => result.insertId);
    });
    // 新增發票
    const addReceipt = await getQueryPromise(`insert into receipts set ?`, [
      {
        serial_number: inputObj.serialNumber,
        time: inputObj.time,
        method: inputObj.method,
        userId: 1,
        tagId,
      },
    ]);
    // 新增 receipt_items 關聯
    for (let i = 0; i < inputObj.items.length; i++) {
      // 先選到 item 資料
      const itemInfo = await getQueryPromise(`select * from items where ?`, [
        {
          serial_number: inputObj.items[i].serialNumber,
        },
      ]).then((data) => {
        if (data.length === 0)
          throw new GeneralError(`不存在品項${inputObj.items[i].serialNumber}`);
        return data[0];
      });
      await getQueryPromise(`insert into receipt_items set ?`, [
        {
          receiptId: addReceipt.insertId,
          itemId: itemInfo.id,
          per_price: itemInfo.per_price,
          quantity: inputObj.items[i].quantity,
        },
      ]);
    }
    await conn.commit();
    return res.status(200).json({
      ok: 1,
      id: addReceipt.insertId,
    });
  },

  delete: async (req, res) => {
    console.log("middleware: delete receipt");
    const id = req.params.id;
    await conn.beginTransaction();
    // 刪除發票本身
    const deleteReceipt = await getQueryPromise(
      `delete from receipts where id = ?`,
      [id]
    );
    if (!deleteReceipt.affectedRows) throw new GeneralError("不存在該發票");
    // 刪除發票細項 (receipt_items)
    const deleteRelation = await getQueryPromise(
      `delete from receipt_items where receiptId = ?`,
      [id]
    );
    await conn.commit();
    return res.status(200).json({
      ok: 1,
    });
  },

  update: async (req, res) => {
    console.log("middleware: update receipt");
    const id = req.params.id;
    const { tagId } = req.body;
    const updateReceipt = await getQueryPromise(
      `update receipts set ? where id = ?`,
      [{ tagId }, id]
    );
    if (!updateReceipt.affectedRows) throw new GeneralError("不存在該發票");
    return res.status(200).json({
      ok: 1,
    });
  },

  getReceipts: async (req, res) => {
    console.log(req.session);
    console.log("middleware: get receipts");
    const { tagId } = req.query;
    const queryArgement = req.query.tagId
      ? {
          sql: `select receipts.*, tags.content as tag from receipts left join tags on tags.id=receipts.tagId where ?`,
          selector: [{ tagId }],
        }
      : {
          sql: `select receipts.*, tags.content as tag from receipts left join tags on tags.id=receipts.tagId`,
          selector: [],
        };
    // 所有發票資料
    const receipts = await getQueryPromise(
      queryArgement.sql,
      queryArgement.selector
    );
    // 發票個別品項
    for (let i = 0; i < receipts.length; i++) {
      const items = await getQueryPromise(
        `select * from receipt_items right join items on receipt_items.itemId=items.id where receiptId=?`,
        [receipts[i].id]
      );
      let itemArr = [];
      items.map((item) => {
        itemArr.push({
          serial_number: item.serial_number,
          content: item.content,
          size: item.size,
          per_price: item.per_price,
          quantity: item.quantity,
        });
      });
      receipts[i].items = itemArr;
    }
    return res.status(200).json({
      ok: 1,
      data: receipts,
    });
  },
};

module.exports = userController;
