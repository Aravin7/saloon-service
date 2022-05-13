const config = require("config.json");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

module.exports = {
  addInventory,
  getAllInventory,
  getSingleInventory,
  removeInventory,
  updateInventory,
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
        //console.log("connection is failed", con);
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

//Get All Inventory list query
const getAllInventoryList = (con) => {
  //console.log("getAllInventoryList");
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM inventory;", function (err, result) {
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

//Get a Inventory item query
const getInventory = (con, id) => {
  //console.log("getInventory", id);
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT * FROM inventory where id= " + id + ";",
      function (err, result) {
        if (err) {
          console.error(err);
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

//update inventory Table query
const updateInventoryTable = (con, id, payload) => {
  //console.log("updateInventoryTable arrived", payload);
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE inventory SET itemName='" +
      payload.name +
      "',	itemDescription='" +
      payload.description +
      "',quantity='" +
      payload.quantity +
      "',manufacturedBy='" +
      payload.manufacturer +
      "',contactNo='" +
      payload.contactNo +
      "' where id= " +
      id +
      ";";

    //console.log(sql, "sql");
    con.query(sql, function (err, result) {
      //console.log(err, result, "result, error");
      if (err) return reject(err);
      if (result.length < 1) {
        //console.log(result, "SFSDFDSFDSFSDFSDFSD");
        return resolve([]);
      } else {
        resolve(result);
      }
    });
  });
};

//Insert Inventory query
const saveInventory = (con, payload) => {
  return new Promise((resolve, reject) => {
    //console.log("saveuser");
    /* 
    chk whether is there any admin user is exist
    if not found any keep register user as admin user else
    kept he as employee
    */
    //console.log(payload);
    con.query(
      "INSERT INTO inventory (itemName, itemDescription,quantity,manufacturedBy,contactNo) VALUES ('" +
        payload.name +
        "', '" +
        payload.description +
        "', '" +
        payload.quantity +
        "', '" +
        payload.manufacturer +
        "', '" +
        payload.contactNo +
        "');",
      function (err, result) {
        if (err) {
          //console.error(err);
          return reject(err);
        }
        //console.log("result", result);
        resolve(result);
      }
    );
  });
};

//Delete Inventory query
const deleteInventory = (con, id) => {
  //console.log("deleteInventory", id);
  return new Promise((resolve, reject) => {
    con.query(
      "DELETE FROM inventory where id= " + id + ";",
      function (err, result) {
        if (err) {
          console.error(err);
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

/* mysql query end */

/* Function list start */
//Get All inventory function
async function getAllInventory() {
  //console.log("getAllInventory");
  try {
    const conn = await db_connection();
    const response = await getAllInventoryList(conn);
    //console.log("getAllInventory", response);
    if (response.length < 1) return "No Data";
    return {
      ...omitPassword(response),
    };
  } catch (e) {
    console.error;
  }
}

//Get Single Inventory function
async function getSingleInventory(id) {
  try {
    const conn = await db_connection();
    //console.log("getSingleInventory db_connection okay");
    const response = await getInventory(conn, id);
    //console.log("getInventory okay", response);
    if (response.length < 1) return "No Data";
    else return response;
  } catch (e) {
    console.error;
  }
}

//Update inventory function
async function updateInventory(id, payload) {
  try {
    const conn = await db_connection();
    const response = await updateInventoryTable(conn, id, payload);
    //console.log(response, "ASDADASDASDADS");
    if (response.length < 1) return "No Data";
    if (response)
      return {
        status: 200,
        msg: "inventory item Updated successfully",
        response,
      };
    return { status: 400, msg: "Something Went Wrong", response };
  } catch (e) {
    if (e.code == "ER_DUP_ENTRY") {
      return { status: 400, msg: "Email already exist" };
    }
    return { status: 400, msg: "Something Went Wrong" };
  }
}

//Remove inventory function
async function removeInventory(id, payload) {
  try {
    //console.log(id, "removeInventory");
    const conn = await db_connection();
    const response = await deleteInventory(conn, id, payload);
    //console.log(response, "removeInventory");
    if (response.length < 1) return "No Data";
    if (response)
      return {
        status: 200,
        msg: "Inventory item delete successfully",
        response,
      };
    return { status: 400, msg: "Something Went Wrong", response };
  } catch (e) {
    return { status: 400, msg: "Something Went Wrong" };
  }
}

//Add Inventory function
async function addInventory(payload) {
  try {
    //console.log("payload", payload);
    const conn = await db_connection();
    //console.log(conn);
    const response = await saveInventory(conn, payload);
    //console.log(response);
    if (response)
      return {
        status: 200,
        msg: "Inventory item added successfully",
        response,
      };
    else return { status: 400, msg: "Something Went Wrong", response };
  } catch (e) {
    console.error;
    return { status: 400, msg: "Something Went Wrong" };
  }
}

// helper functions
function omitPassword(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
