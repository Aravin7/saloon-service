const express = require("express");
const router = express.Router();
const userService = require("./user.service");

// routes
router.post("/authenticate", authenticate);
router.get("/", getAll);
router.post("/", registerUser);
router.get("/user", getSingleUser);
router.put("/user", updateUser);

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
