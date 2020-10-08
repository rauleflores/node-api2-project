const { text } = require("express");
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

router.post("/api/posts/:id/comments", (req, res) => {
  const id = req.params.id;
  const { text } = req.body;
  db.findById(id)
    .then((post) => {
      if (post.length < 1) {
        res.status(404).json({
          errorMessage: "The post with the specified ID does not exist.",
        });
      } else if (post.length > 0 && !text) {
        res.status(400).json({
          errorMessage: "Please provide text for the comment.",
        });
      } else if (post.length > 0 && text) {
        const newComment = {
          text: text,
          post_id: post[0].id,
        };
        console.log(newComment);
        db.insertComment(newComment)
          .then((insert) => {
            res.status(201).json(insert);
          })
          .catch((error) => {
            res.status(500).json({
              errorMessage:
                "There was an error while saving the comment to the database.",
            });
          });
      } else {
        return post;
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        errorMessage: "The post information could not be retrieved.",
      });
    });
});

router.delete("/api/posts/:id", (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then((post) => {
      console.log(id);
      console.log("post:", post);
      if (!post) {
        res.status(404).json({
          errorMessage: "The post with the specified ID does not exist.",
        });
      } else {
        res.json(post);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        errorMessage: "The post could not be removed.",
      });
    });
});

router.put("/api/posts/:id", (req, res) => {
  const id = req.params.id;
  const { title, contents } = req.body;
  db.findById(id)
    .then((post) => {
      if (post.length < 1) {
        res.status(404).json({
          errorMessage: "The post with the specified ID does not exist.",
        });
      } else if (post.length > 0 && (!title || !contents)) {
        res.status(400).json({
          errorMessage: "Please provide title and/or contents for the post.",
        });
      } else if (post.length > 0 && title && contents) {
        const updates = {
          title: title,
          contents: contents,
        };
        db.update(id, updates)
          .then((updates) => {
            res.status(201).json(updates);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              errorMessage: "The post information could not be modified.",
            });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({
        errorMessage: "The post information could not be retrieved.",
      });
    });
});

module.exports = router;
