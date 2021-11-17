const express = require("express");
const router = express.Router();
const itemService = require("./items.service");

router.get('/', getAll);

module.exports = router;

function getAll(req, res, next) {
    itemService
      .getAllItems(req.body)
      .then((response) =>{
        res.status(response.status);
        res.json(response);
      })
      .catch(next);
  }