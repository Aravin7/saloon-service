const express = require("express");
const router = express.Router();
const userService = require("./blogs.service");

// routes

router.post("/", addBlog); //save blog
router.put("/:id", updateBlog);
router.delete("/:id", removeBlog);
router.get("/edit/:id", getSingleBlog);
router.get("/", getAllBlog);

module.exports = router;

function getAllBlog(req, res, next) {
  userService
    .getAllBlog()
    .then((users) => res.json(users))
    .catch(next);
}

function getSingleBlog(req, res, next) {
 /*  userService
    .getSingleBlog(req.query.id)
    .then((users) => res.json(users))
    .catch(next); */
}

function updateBlog(req, res, next) {
  userService
    .updateBlog(req.query.id, req.body)
    .then((users) => res.json(users))
    .catch(next);
}

function removeBlog(req, res, next) {
  userService
    .removeBlog(req.query.id, req.body)
    .then((users) => res.json(users))
    .catch(next);
}

function addBlog(req, res, next) {
  userService
    .addBlog(req.body)
    .then((response) => {
      res.status(response.status);
      res.json(response);
    })
    .catch(next);
}
