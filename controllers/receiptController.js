const mysql = require("mysql");
const {
  GeneralError,
  MissingError,
  VarifyError,
} = require("../middlewares/error");

// 可回頭加強: transaction, userId
const userController = {
  add: async (req, res) => {
    console.log("middleware: add receipt");
    const inputText = req.file.buffer.toString();
    const template = /(((?<=Date:).+(?= ))|((?<=Time:).+(?=\r))|((?<=Receipt ID:).+(?= ))|CASH|MASTER|VISA|\d{13}|\d+(?= x))/g;
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
    const input = {
      time: new Date(...dateArr),
      serialNumber: inputArr[2].replace("  ", ""),
      items: itemArr,
      method: inputArr[inputArr.length - 1],
    };
    const connection = mysql.createConnection(res.locals.pool);
    connection.query(
      "insert into receipts set ?",
      {
        serial_number: input.serialNumber,
        time: input.time,
        method: input.method,
        userId: 1,
      },
      function (err, fields) {
        if (err) throw new GeneralError(err);
        input.items.map((item) => {
          connection.query(
            "select * from items where ?",
            {
              serial_number: item.serialNumber,
            },
            function (err, itemInfo) {
              if (err) throw new GeneralError(err);
              connection.query(
                "insert into receipt_items set ?",
                {
                  receiptId: fields.insertId,
                  itemId: itemInfo[0].id,
                  per_price: itemInfo[0].per_price,
                  quantity: item.quantity,
                },
                function (err, result) {
                  if (err) throw new GeneralError(err);
                  console.log("新增成功！");
                }
              );
            }
          );
        });
        return res.status(200).json({
          ok: 1,
          id: fields.insertId,
        });
      }
    );
  },

  delete: async (req, res) => {
    console.log("middleware: delete receipt");
    const id = req.params.id;
    const connection = mysql.createConnection(res.locals.pool);
    connection.query(
      "delete from receipts where id = ?",
      id,
      function (err, fields) {
        if (err) throw new GeneralError(err);
        if (!fields.affectedRows) throw new GeneralError("不存在該發票");
      }
    );
    connection.query(
      "delete from receipt_items where receiptId = ?",
      id,
      function (err, fields) {
        if (err) throw new GeneralError(err);
        return res.status(200).json({
          ok: 1,
        });
      }
    );
  },

  update: async (req, res) => {
    console.log("middleware: update receipt");
    const id = req.params.id;
    const { tagId } = req.body;
    const connection = mysql.createConnection(res.locals.pool);
    connection.query(
      "update receipts set ? where id = ?",
      [{ tagId }, id],
      function (err, fields) {
        if (err) throw new GeneralError(err);
        if (!fields.affectedRows) throw new GeneralError("不存在該發票");
        return res.status(200).json({
          ok: 1,
        });
      }
    );
  },

  // 記得回來修
  getReceipts: async (req, res) => {
    console.log("middleware: get receipts");
    const connection = mysql.createConnection(res.locals.pool);
    connection.query("select * from receipts", (err, datas) => {
      if (err) throw new GeneralError(err);
      /*
      datas.map(async (data) => {
        await connection.query(
          `select * from receipt_items where receiptId=? `,
          data.id,
          async (err, orders) => {
            if (err) throw new GeneralError(err);
            let itemsArr = [];
            await orders.map((order) => {
              connection.query(
                `select * from items where id=? ;`,
                order.itemId,
                (err, items) => {
                  if (err) throw new GeneralError(err);
                  items.map((item) =>
                    itemsArr.push({
                      serial_number: item.serial_number,
                      content: item.content,
                      size: item.size,
                    })
                  );
                  order.items = itemsArr;
                }
              );
            });
            console.log(orders);
          }
        );
      });
              */
      return res.status(200).json({
        ok: 1,
        data: datas,
      });
    });
  },

  // 記得回來修
  getReceiptsByTag: async (req, res) => {
    console.log("middleware: get receipts");
    const tagId = req.query.tagId;
    const connection = mysql.createConnection(res.locals.pool);
    connection.query(
      "select * from receipts where ?",
      { tagId },
      (err, datas) => {
        if (err) throw new GeneralError(err);
        /*
      datas.map(async (data) => {
        await connection.query(
          `select * from receipt_items where receiptId=? `,
          data.id,
          async (err, orders) => {
            if (err) throw new GeneralError(err);
            let itemsArr = [];
            await orders.map((order) => {
              connection.query(
                `select * from items where id=? ;`,
                order.itemId,
                (err, items) => {
                  if (err) throw new GeneralError(err);
                  items.map((item) =>
                    itemsArr.push({
                      serial_number: item.serial_number,
                      content: item.content,
                      size: item.size,
                    })
                  );
                  order.items = itemsArr;
                }
              );
            });
            console.log(orders);
          }
        );
      });
              */
        return res.status(200).json({
          ok: 1,
          data: datas,
        });
      }
    );
  },
};

module.exports = userController;
