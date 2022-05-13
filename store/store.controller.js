const express = require("express");
const router = express.Router();
const storeService = require("./store.service");

// routes

router.post("/", addStore); //save store item
router.put("/edit", updateStore);
router.delete("/", removeStore);
router.get("/store", getSingleStore);
router.get("/", getAllStore);

module.exports = router;

function getAllStore(req, res, next) {
  storeService
    .getAllStore()
    .then((users) => res.json(users))
    .catch(next);
}

function getSingleStore(req, res, next) {
  //console.log("req.query.id", req.query.id);
  storeService
    .getSingleStore(req.query.id)
    .then((users) => res.json(users))
    .catch(next);
}

function updateStore(req, res, next) {
  storeService
    .updateStore(req.query.id, req.body)
    .then((users) => res.json(users))
    .catch(next);
}

function removeStore(req, res, next) {
  //console.log("hi");
  storeService
    .removeStore(req.query.id)
    .then((users) => res.json(users))
    .catch(next);
}

function addStore(req, res, next) {
  storeService
    .addStore(req.body)
    .then((response) => {
      res.status(response.status);
      res.json(response);
    })
    .catch(next);
}
