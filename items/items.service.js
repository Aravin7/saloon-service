const config = require("config.json");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

module.exports = {
  getAllItems,
};

const db_connection = () => {
  return new Promise((resolve, reject) => {
    var con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "test_db",
    });
    con.connect(function (err) {
      if (err) return reject(err);
      resolve(con);
    });
  });
};

const getAllItemsList = (con, id) => {
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM items;", function (err, result) {
      if (err) return reject(err);
      if (result.length < 1) {
        return resolve([]);
      } else {
        resolve(result);
      }
    });
  });
};

async function getAllItems() {
  try {
    const conn = await db_connection();
    const response = await getAllItemsList(conn);
    if (response.length < 1)
      return {
        status: 200,
        message: "No Record Found",
      };
    return {
      status: 200,
      response,
    };
  } catch (e) {
    console.error;
    if (e.code == "ER_NO_SUCH_TABLE") {
      return {
        status: 400,
        message: "no table found",
      };
    }
    return {
      status: 400,
      message: "something went wrong",
    };
  }
}
