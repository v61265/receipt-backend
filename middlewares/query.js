const mysql = require("mysql");
const { db } = require("../config");

const conn = mysql.createConnection({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database,
});

const getQueryPromise = (sql, selectorsArr) => {
  return new Promise((resolve, reject) => {
    conn.query(sql, selectorsArr, (err, data) => {
      if (err) return reject(err);
      else resolve(data);
    });
  });
};

module.exports = {
  getQueryPromise,
  conn,
};
