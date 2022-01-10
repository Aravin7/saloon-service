const config = require("config.json");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

module.exports = {
  authenticate,
  getAll,
  registerUser,
  getSingleUser,
  updateUser,
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

const verifyUser = (con, username, password) => {
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT * FROM users WHERE email='" +
        username +
        "' and password='" +
        password +
        "';",
      function (err, result) {
        if (err) return reject(err);

        if (result.length < 1) {
          return resolve([]);
        } else {
          resolve(result[0]);
        }
      }
    );
  });
};

const getAllUsers = (con) => {
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM users;", function (err, result) {
      if (err) return reject(err);
      if (result.length < 1) {
        return resolve([]);
      } else {
        resolve(result);
      }
    });
  });
};

const getUser = (con, id) => {
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT * FROM users where id= " + id + ";",
      function (err, result) {
        if (err) return reject(err);
        if (result.length < 1) {
          return resolve([]);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const updateUserTable = (con, id, payload) => {
  console.log("Update arrived", payload);
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE users SET username='" +
      payload.username +
      "',email='" +
      payload.email +
      "' where id= " +
      id +
      ";";

    console.log(sql, "sql");
    con.query(sql, function (err, result) {
      console.log(err, result, "result, error");
      if (err) return reject(err);
      if (result.length < 1) {
        console.log(result, "SFSDFDSFDSFSDFSDFSD");
        return resolve([]);
      } else {
        resolve(result);
      }
    });
  });
};

const saveUser = (con, payload) => {
  return new Promise((resolve, reject) => {
    console.log("saveuser");
    con.query(
      "INSERT INTO users (username, password, email) VALUES ('" +
        payload.username +
        "', '" +
        payload.password +
        "','" +
        payload.email +
        "');",
      function (err, result) {
        if (err) return reject(err);

        console.log(result);
        resolve(result);
      }
    );
  });
};

async function authenticate({ username, password }) {
  try {
    //console.log(username);
    const conn = await db_connection();
    //console.log("db_connection");
    const response = await verifyUser(conn, username, password);
    //console.log("verifyUser");
    if (response.length < 1) return "Username or password is incorrect";
    //console.log("pass");
    const token = jwt.sign({ sub: response.id }, config.secret, {
      expiresIn: "7d",
    });
    //console.log("pass");
    return {
      ...omitPassword(response),
      token,
    };
    //console.log("finished");
  } catch (e) {
    console.error;
  }
}

async function getAll() {
  try {
    const conn = await db_connection();
    const response = await getAllUsers(conn);
    if (response.length < 1) return "No Data";
    return {
      ...omitPassword(response),
    };
  } catch (e) {
    console.error;
  }
}

async function getSingleUser(id) {
  try {
    const conn = await db_connection();
    const response = await getUser(conn, id);
    if (response.length < 1) return "No Data";
    return {
      ...omitPassword(response),
    };
  } catch (e) {
    console.error;
  }
}

async function updateUser(id, payload) {
  try {
    const conn = await db_connection();
    const response = await updateUserTable(conn, id, payload);
    console.log(response, "ASDADASDASDADS");
    if (response.length < 1) return "No Data";
    if (response)
      return { status: 200, msg: "User Updated successfully", response };
    return { status: 400, msg: "Something Went Wrong", response };
  } catch (e) {
    if (e.code == "ER_DUP_ENTRY") {
      return { status: 400, msg: "Email already exist" };
    }
    return { status: 400, msg: "Something Went Wrong" };
  }
}

async function registerUser(payload) {
  try {
    console.log("payload", payload);
    const conn = await db_connection();
    console.log(conn);
    const response = await saveUser(conn, payload);
    if (response)
      return { status: 200, msg: "User added successfully", response };
    return { status: 400, msg: "Something Went Wrong", response };
  } catch (e) {
    console.error;
    if (e.code == "ER_DUP_ENTRY") {
      return { status: 400, msg: "Email already exist" };
    }
    return { status: 400, msg: "Something Went Wrong" };
  }
}

// helper functions

function omitPassword(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
