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

router.get("/api/posts/:id/comments", (req, res) => {
  const id = req.params.id;
  db.findPostComments(id)
    .then((comments) => {
      if (comments.length !== 0) {
        res.status(200).json(comments);
      } else {
        res.status(404).json({
          errorMessage: "The post with the specified ID does not exist.",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        errorMessage: "The comments could not be retrieved.",
      });
    });
});

router.post("/api/posts", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }
  db.insert({ title, contents })
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        errorMessage: "Could not create a post.",
      });
    });
});

module.exports = router;
