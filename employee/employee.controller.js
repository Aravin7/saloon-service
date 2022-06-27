const express = require("express");
const router = express.Router();
const employeeService = require("./employee.service");

// routes

router.post("/", addEmployee); //save Employee item
router.put("/edit", updateEmployee);
router.delete("/", removeEmployee);
router.get("/employee", getSingleEmployee);
router.get("/", getAllEmployee);

module.exports = router;

function getAllEmployee(req, res, next) {
  employeeService
    .getAllEmployee()
    .then((users) => res.json(users))
    .catch(next);
}

function getSingleEmployee(req, res, next) {
  //console.log("req.query.id", req.query.id);
  employeeService
    .getSingleEmployee(req.query.id)
    .then((users) => res.json(users))
    .catch(next);
}

function updateEmployee(req, res, next) {
  employeeService
    .updateEmployee(req.query.id, req.body)
    .then((users) => res.json(users))
    .catch(next);
}

function removeEmployee(req, res, next) {
  //console.log("hi");
  employeeService
    .removeEmployee(req.query.id)
    .then((users) => res.json(users))
    .catch(next);
}

function addEmployee(req, res, next) {
  employeeService
    .addEmployee(req.body)
    .then((response) => {
      res.status(response.status);
      res.json(response);
    })
    .catch(next);
}
