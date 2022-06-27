const express = require("express");
const router = express.Router();
const blogService = require("./blogs.service");

// routes

router.post("/", addBlog); //save blog
router.put("/edit", updateBlog);
router.delete("/", removeBlog);
router.get("/blog", getSingleBlog);
router.get("/", getAllBlog);

module.exports = router;

function getAllBlog(req, res, next) {
  blogService
    .getAllBlog()
    .then((users) => res.json(users))
    .catch(next);
}

function getSingleBlog(req, res, next) {
  //console.log("req.query.id", req.query.id);
  blogService
    .getSingleBlog(req.query.id)
    .then((users) => res.json(users))
    .catch(next);
}

function updateBlog(req, res, next) {
  blogService
    .updateBlog(req.query.id, req.body)
    .then((users) => res.json(users))
    .catch(next);
}

function removeBlog(req, res, next) {
  //console.log("hi");
  blogService
    .removeBlog(req.query.id)
    .then((users) => res.json(users))
    .catch(next);
}

function addBlog(req, res, next) {
  blogService
    .addBlog(req.body)
    .then((response) => {
      res.status(response.status);
      res.json(response);
    })
    .catch(next);
}
