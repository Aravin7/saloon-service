const express = require("express");
const router = express.Router();
const inventoryService = require("./inventory.service");

// routes

router.post("/", addInventory); //save inventory item
router.put("/edit", updateInventory);
router.delete("/", removeInventory);
router.get("/inventory", getSingleInventory);
router.get("/", getAllInventory);

module.exports = router;

function getAllInventory(req, res, next) {
  inventoryService
    .getAllInventory()
    .then((users) => res.json(users))
    .catch(next);
}

function getSingleInventory(req, res, next) {
  //console.log("req.query.id", req.query.id);
  inventoryService
    .getSingleInventory(req.query.id)
    .then((users) => res.json(users))
    .catch(next);
}

function updateInventory(req, res, next) {
  inventoryService
    .updateInventory(req.query.id, req.body)
    .then((users) => res.json(users))
    .catch(next);
}

function removeInventory(req, res, next) {
  //console.log("hi");
  inventoryService
    .removeInventory(req.query.id)
    .then((users) => res.json(users))
    .catch(next);
}

function addInventory(req, res, next) {
  inventoryService
    .addInventory(req.body)
    .then((response) => {
      res.status(response.status);
      res.json(response);
    })
    .catch(next);
}
