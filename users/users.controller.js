const express = require("express");
const router = express.Router();
const userService = require("./user.service");


// routes
/* Public routes */
router.post("/authenticate", authenticate);
router.post("/register", registerUserCustomer); //register customer,

/* Private routes */
router.post("/", registerUser); //register employee
router.get("/user", getSingleUser);
router.put("/user", updateUser);
router.get("/", getAll);

module.exports = router;

function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then((user) => res.json(user))
    .catch(next);
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function getSingleUser(req, res, next) {
  userService
    .getSingleUser(req.query.id)
    .then((users) => res.json(users))
    .catch(next);
}

function updateUser(req, res, next) {
  userService
    .updateUser(req.query.id, req.body)
    .then((users) => res.json(users))
    .catch(next);
}

function registerUser(req, res, next) {
  userService
    .registerUser(req.body)
    .then((response) => {
      res.status(response.status);
      res.json(response);
    })
    .catch(next);
}
function registerUserCustomer(req, res, next) {
  userService
    .registerUserCustomer(req.body)
    .then((response) => {
      res.status(response.status);
      res.json(response);
    })
    .catch(next);
}
