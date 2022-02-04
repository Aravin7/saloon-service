const config = require("config.json");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  authenticate,
  getAll,
  registerUser,
  registerUserCustomer,
  getSingleUser,
  updateUser,
};

const db_connection = () => {
  return new Promise((resolve, reject) => {
    var con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "eagle_saloon_db",
    });
    con.connect(function (err) {
      if (err) {
        console.log("connection is failed", con);
        return reject(err);
      } else resolve(con);
    });
  });
};

const verifyUser = (con, email, password) => {
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT password FROM users WHERE email='" + email + "';",
      function (err, result) {
        if (err) return reject(err);
        if (result.length < 1) {
          return resolve([]);
        } else {
          //console.log("data related to the password is successfuly retrived");
          let hash = result[0].password;
          var validPassword = bcrypt.compareSync(password, hash);
          //console.log("validPassword", validPassword);
          if (validPassword) {
            con.query(
              "SELECT user_id,email,created_date,role FROM users WHERE email='" +
                email +
                "' and password='" +
                hash +
                "';",
              function (err, result) {
                //console.log("result", result[0]);
                if (err) return reject(err);
                if (result.length < 1) {
                  return resolve([]);
                } else {
                  console.log("returend the data");
                  return resolve(result[0]);
                }
              }
            );
          } else console.log("Not valid passowrd/hash is wrong");
        }
      }
    );
  });
};

/* const verifyUser = (con, email, password) => {
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT * FROM users WHERE email='" +
        email +
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
}; */

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
    /* 
    chk whether is there any admin user is exist
    if not found any keep register user as admin user else
    kept he as employee
    */
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

const saveUserCustomer = (con, payload) => {
  return new Promise((resolve, reject) => {
    //console.log("saveUserCustomer");
    const role = "customer";
    /*
    console.log("saveUserCustomer", payload);
    console.log(payload.password);
    console.log("role", role);
    */
    console.log(payload);
    //Hashing Password
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(payload.password, saltRounds);

    let sql =
      "INSERT INTO users (email,password,role) VALUES ('" +
      payload.email +
      "', '" +
      passwordHash +
      "','" +
      role +
      "');";
    con.query(sql, function (err, result) {
      if (err) return reject(err);
      //console.log(result);
      resolve(result);
    });
    sql =
      "INSERT INTO customer (cus_name,tel_no,user_id) VALUES ('" +
      payload.cus_name +
      "', '" +
      payload.tel_no +
      "',LAST_INSERT_ID());";
    con.query(sql, function (err, result) {
      if (err) return reject(err);
      //console.log(result);
      resolve(result);
    });
  });
};

/*
const saveUserCustomer = (con, payload) => {
  return new Promise((resolve, reject) => {
    //console.log("saveUserCustomer");
    const role = "customer";
   
    // console.log("saveUserCustomer", payload);
    // console.log(payload.password);
    // console.log("role", role);
    

    //Hashing Password
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(payload.password, saltRounds);
    let sql =
      "INSERT INTO users (email,password,role) VALUES ('" +
      payload.email +
      "', '" +
      passwordHash +
      "','" +
      role +
      "');";
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) return reject(err);
      console.log(result);
      resolve(result);
    });
    sql =
      "INSERT INTO customer (cus_name,tel_no,user_id) VALUES ('" +
      payload.cus_name +
      "', '" +
      payload.tel_no +
      "',LAST_INSERT_ID());";
    con.query(sql, function (err, result) {
      if (err) return reject(err);
      console.log(result);
      resolve(result);
    });
    console.log("orange");
  });
}; 
*/

async function authenticate({ email, password }) {
  try {
    console.log(email);
    let formPassword = password;
    //console.log(formPassword);
    const conn = await db_connection();
    //console.log("db_connection ok");
    if (email === "") {
      alert("Name must be filled out");
      return false;
    }
    const response = await verifyUser(conn, email, password);

    //console.log("response", response.password);
    console.log("response", response);
    //console.log("response", response.length);

    //if (!verified) return "email or password is incorrect";
    if (response.length < 1) return "email or password is incorrect";
    //console.log("email or password is correct");
    const token = jwt.sign({ sub: response.id }, config.secret, {
      expiresIn: "7d",
    });
    //console.log("jwt token is genarated");
    return {
      ...omitPassword(response),
      token,
    };
    //console.log("finished");
  } catch (e) {
    console.error;
  }
}

/* async function authenticate({ email, password }) {
  try {
    console.log(email);
    let formPassword = password;
    console.log(formPassword);
    const conn = await db_connection();
    console.log("db_connection ok");
    const response = await verifyUser(conn, email, password);
    let comparePassword = bcrypt.hashSync(password, 8);

    console.log("response", response.password);
    console.log("response", response);

    /// console.log("response", response.length);

    //let hashedPassword = response.password;
    //chk  hashedPassword==formPassword
    //if it nt sucess message -> return "email or password is incorrect"
    //const verified = bcrypt.compareSync(formPassword, hashedPassword);
    //if (!verified) return "email or password is incorrect";
    if (response.length < 1) return "email or password is incorrect";
    console.log("pass");
    const token = jwt.sign({ sub: response.id }, config.secret, {
      expiresIn: "7d",
    });
    console.log("pass");
    return {
      ...omitPassword(response),
      token,
    };

    //console.log("finished");
  } catch (e) {
    console.error;
  }
}
 */

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
    else return { status: 400, msg: "Something Went Wrong", response };
  } catch (e) {
    console.error;
    if (e.code == "ER_DUP_ENTRY") {
      return { status: 400, msg: "Email already exist" };
    }
    return { status: 400, msg: "Something Went Wrong" };
  }
}

/* async function registerUser(payload) {
  try {
    console.log("payload", payload);
    const conn = await db_connection();
    console.log(conn);
    const response = await saveUser(conn, payload);
    if (response)
      return { status: 200, msg: "User added successfully", response };
    else return { status: 400, msg: "Something Went Wrong", response };
  } catch (e) {
    console.error;
    if (e.code == "ER_DUP_ENTRY") {
      return { status: 400, msg: "Email already exist" };
    }
    return { status: 400, msg: "Something Went Wrong" };
  }
}
 */

async function registerUserCustomer(payload) {
  try {
    console.log("registerUserCustomer payload", payload);
    const conn = await db_connection();
    console.log("conn Ok");
    const response = await saveUserCustomer(conn, payload);
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

/* 
async function registerUserCustomer(payload) {
  try {
    console.log("registerUserCustomer payload", payload);
    const conn = await db_connection();
    console.log("conn Ok");
    const response = await saveUserCustomer(conn, payload);
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
 */

// helper functions
function omitPassword(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/* function isEmptyValues(value) {
  return (
    value === undefined ||
    value === null ||
    /   (typeof value === "object" && Object.keys(value).length === 0) ||
      (typeof value === "string" && value.trim().length() === 0)
  );
}
 */
