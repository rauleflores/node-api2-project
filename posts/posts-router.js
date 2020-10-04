const express = require("express");
const db = require("../data/db");

const router = express.Router();

router.get("/api/posts", (req, res) => {
  db.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        errorMessage: "The posts information could not be retrieved.",
      });
    });
});

router.get("/api/posts/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then((post) => {
      if (Array.isArray(post) && post.length !== 0) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          errorMessage: "The post you are looking for does not exist.",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        errorMessage: "The post information could not be retrieved.",
      });
    });
});

module.exports = router;
