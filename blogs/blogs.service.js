const config = require("config.json");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

module.exports = {
  addBlog,
  getAllBlog,
  getSingleBlog,
  removeBlog,
  updateBlog,
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
const getAllBlogList = (con) => {
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM blogs;", function (err, result) {
      if (err) return reject(err);
      if (result.length < 1) {
        return resolve([]);
      } else {
        resolve(result);
      }
    });
  });
};

const getBlog = (con, id) => {
  /* return new Promise((resolve, reject) => {
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
  }); */
};

const updateBlogTable = (con, id, payload) => {
  console.log("Update arrived", payload);
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE blogs SET blog_title='" +
      payload.title +
      "',blog_content='" +
      payload.content +
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

const saveBlog = (con, payload) => {
  return new Promise((resolve, reject) => {
    //console.log("saveuser");
    /* 
    chk whether is there any admin user is exist
    if not found any keep register user as admin user else
    kept he as employee
    */
    con.query(
      "INSERT INTO blogs (blog_title, blog_content) VALUES ('" +
        payload.title +
        "', '" +
        payload.content +
        "');",
      function (err, result) {
        if (err) return reject(err);
        console.log("result", result);
        resolve(result);
      }
    );
  });
};
//mysql query end

async function getAllBlog() {
  try {
    const conn = await db_connection();
    const response = await getAllBlogList(conn);
    if (response.length < 1) return "No Data";
    return {
      ...omitPassword(response),
    };
  } catch (e) {
    console.error;
  }
}

async function getSingleBlog(id) {
  try {
    const conn = await db_connection();
    const response = await getBlog(conn, id);
    if (response.length < 1) return "No Data";
    return {
      ...omitPassword(response),
    };
  } catch (e) {
    console.error;
  }
}

async function updateBlog(id, payload) {
  try {
    const conn = await db_connection();
    const response = await updateBlogTable(conn, id, payload);
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

async function removeBlog(id, payload) {
  try {
    const conn = await db_connection();
    const response = await updateBlogTable(conn, id, payload);
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

async function addBlog(payload) {
  try {
    //console.log("payload", payload);
    const conn = await db_connection();
    //console.log(conn);
    const response = await saveBlog(conn, payload);
    console.log(response);
    if (response)
      return { status: 200, msg: "Blog added successfully", response };
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
