const config = require("config.json");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  addEmployee,
  getAllEmployee,
  getSingleEmployee,
  removeEmployee,
  updateEmployee,
};

//database connection
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

/* 
//SELECT u.user_id,u.email,u.created_date,u.role,c.cus_name FROM users AS u JOIN customer AS c ON(u,user_id=c.user_id)
const verifyUser = (con, email, password) => {
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT password,role FROM users WHERE email='" + email + "';",
      function (err, result) {
        console.log("result", result);
        if (err) return reject(err);
        if (result.length < 1) {
          return resolve([]);
        } else {
          console.log("data related to the password is successfully retrieved");
          const hash = result[0].password;
          const role = result[0].role;
          var validPassword = bcrypt.compareSync(password, hash);
          console.log("validPassword", validPassword);
          if (validPassword) {
            if (role === "admin") {
              con.query(
                "SELECT u.user_id,u.email,u.created_date,u.role,c.admin_name FROM users AS u JOIN admin AS c ON(u.user_id=c.user_id) WHERE u.email='" +
                  email +
                  "' and u.password='" +
                  hash +
                  "';",
                function (err, result) {
                  //console.log("result", result[0]);
                  if (err) return reject(err);
                  if (result.length < 1) {
                    return resolve([]);
                  } else {
                    console.log("returned the data");
                    return resolve(result[0]);
                  }
                }
              );
            } else {
              con.query(
                "SELECT u.user_id,u.email,u.created_date,u.role,c.emp_name FROM users AS u JOIN employee AS c ON(u.user_id=c.user_id) WHERE u.email='" +
                  email +
                  "' and u.password='" +
                  hash +
                  "';",
                function (err, result) {
                  //console.log("result", result[0]);
                  if (err) return reject(err);
                  if (result.length < 1) {
                    return resolve([]);
                  } else {
                    console.log("returned the data");
                    return resolve(result[0]);
                  }
                }
              );
            }
          } else console.log("Not valid password/hash is wrong");
        }
      }
    );
  });
};
 */

//mysql query start

//Get All store list query
const getAllEmployeeList = (con) => {
  //console.log("getAllEmployeeList");
  const sql =
    "SELECT emp_id,f_name,l_name,nic,address,gender,tel_no,email FROM employee e,users u where role='emp' and e.user_id=u.user_id;";

  return new Promise((resolve, reject) => {
    con.query(sql, function (err, result) {
      if (err) return reject(err);
      if (result.length < 1) {
        return resolve([]);
      } else {
        //console.log("Data successfully retrieved");
        resolve(result);
      }
    });
  });
};

//Get a store item query
const getEmployee = (con, id) => {
  //console.log("getStore");
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT u.email,u.password ,u.user_id, e.f_name ,e.l_name,e.nic,e.address,e.gender,e.tel_no FROM users AS u JOIN employee AS e ON (u.user_id=e.user_id) where emp_id= " +
        id +
        ";",
      function (err, result) {
        if (err) {
          //console.error(err);
          return reject(err);
        }
        if (result.length < 1) {
          return resolve([]);
        } else {
          //console.log(result);
          resolve(result);
        }
      }
    );
  });
};

//update Employee Table query
const updateEmployeeTable = (con, id, payload) => {
  //console.log("updateEmployeeTable arrived payload", payload);
  //console.log(id);

  return new Promise((resolve, reject) => {
    //console.log("hi");
    const sql =
      "UPDATE employee e, users u SET u.email='" +
      payload.email +
      "', u.password='" +
      payload.password +
      "',e.f_name='" +
      payload.f_name +
      "', e.l_name='" +
      payload.l_name +
      "',e.nic='" +
      payload.nic +
      "',e.address='" +
      payload.address +
      "',e.gender='" +
      payload.gender +
      "',e.tel_no='" +
      payload.telephone +
      "' WHERE u.user_id=" +
      payload.user_id +
      " AND e.emp_id=" +
      id +
      ";";

    //console.log(sql, "sql");
    con.query(sql, function (err, result) {
      //console.log("result: ", result, "error:", err);
      if (err) {
        //console.error(err);
        return reject(err);
      }
      if (result.length < 1) {
        //console.log(result, "SFSDFDSFDSFSDFSDFSD");
        return resolve([]);
      } else {
        resolve(result);
      }
    });
  });
};

//Insert Employee query
const saveEmployee = (con, payload) => {
  return new Promise((resolve, reject) => {
    //console.log("saveuser");
    /* 
    chk whether is there any admin user is exist
    if not found any keep register user as admin user else
    kept he as employee
    */
    //console.log("saveEmployee payload", payload);
    const role = "emp";

    //Hashing Password
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(payload.password, saltRounds);

    //console.log("saltRounds");

    let sql =
      "INSERT INTO users (email,password,role) VALUES ('" +
      payload.email +
      "', '" +
      passwordHash +
      "','" +
      role +
      "');";
    con.query(sql, function (err, result) {
      //console.log("err 1 sql ", err);
      if (err) {
        console.log("err 1 sql ", err);
        //return reject(err);
      }
      //console.log("result", result);
      resolve(result);
    });
    console.log("PASS 1 sql");
    sql =
      "INSERT INTO employee (f_name,l_name,nic,address,gender,tel_no,user_id) VALUES ('" +
      payload.f_name +
      "', '" +
      payload.l_name +
      "', '" +
      payload.nic +
      "', '" +
      payload.address +
      "', '" +
      payload.gender +
      "', '" +
      payload.telephone +
      "',LAST_INSERT_ID());";
    con.query(sql, function (err, result) {
      //console.log("err2 sql ", err);
      if (err) {
        console.log("err2 sql ", err);
        //return reject(err);
      }
      //console.log("result", result);
      resolve(result);
    });
  });
};

//Delete store query
const deleteEmployee = (con, id) => {
  console.log("deleteEmployee", id);
  return new Promise((resolve, reject) => {
    con.query(
      "DELETE from users WHERE user_id= (SELECT user_id FROM employee WHERE emp_id=" +
        id +
        ");",
      function (err, result) {
        if (err) {
          console.error(err);
          //return reject(err);
        }
        if (result.length < 1) {
          return resolve([]);
        } else {
          //console.log(result);
          resolve(result);
        }
      }
    );
  });
};

/* mysql query end */

/* Function list start */
//Get All store function
async function getAllEmployee() {
  //console.log("getAllStore");
  try {
    const conn = await db_connection();
    const response = await getAllEmployeeList(conn);
    //console.log("getAllEmployee", response);
    if (response.length < 1) return "No Data";
    return {
      ...omitPassword(response),
    };
  } catch (e) {
    console.error;
  }
}

//Get Single store function
async function getSingleEmployee(id) {
  try {
    const conn = await db_connection();
    //console.log("getSingleEmployee db_connection okay");
    const response = await getEmployee(conn, id);
    //console.log("getSingleEmployee okay", response);
    if (response.length < 1) return "No Data";
    else return response;
  } catch (e) {
    console.error;
  }
}

//Update store function
async function updateEmployee(id, payload) {
  try {
    const conn = await db_connection();
    const response = await updateEmployeeTable(conn, id, payload);
    //console.log(response, "ASDADASDASDADS");
    if (response.length < 1) return "No Data";
    if (response)
      return { status: 200, msg: "User Updated successfully", response };
    return { status: 400, msg: "Something Went Wrong", response };
  } catch (e) {
    if (e.code == "ER_DUP_ENTRY") {
      return { status: 400, msg: "employee already exist" };
    }
    return { status: 400, msg: "Something Went Wrong" };
  }
}

//Remove Store function
async function removeEmployee(id, payload) {
  try {
    //console.log(id, "removeEmployee");
    const conn = await db_connection();
    const response = await deleteEmployee(conn, id, payload);
    //console.log(response, "removeEmployee");
    if (response.length < 1) return "No Data";
    if (response)
      return {
        status: 200,
        msg: "Employee item delete successfully",
        response,
      };
    return { status: 400, msg: "Something Went Wrong", response };
  } catch (e) {
    return { status: 400, msg: "Something Went Wrong" };
  }
}

//Add store function
async function addEmployee(payload) {
  try {
    //console.log("payload", payload);
    const conn = await db_connection();
    //console.log(conn);
    const response = await saveEmployee(conn, payload);
    //console.log("addEmployee response", response);
    if (response)
      return {
        status: 200,
        msg: "Employee item added successfully",
        response,
      };
    else return { status: 400, msg: "Something Went Wrong", response };
  } catch (e) {
    console.error;
    if (e.code == "ER_DUP_ENTRY") {
      return { status: 400, msg: "employee email or nic already exist" };
    }
    return { status: 400, msg: "Something Went Wrong" };
  }
}

// helper functions
function omitPassword(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
