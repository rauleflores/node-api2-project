const express = require("express");
const postsRouter = require("./posts/posts-router.js");
const welcomeRouter = require("./welcome/welcome-router.js");

const server = express();

server.use(express.json());
server.use(welcomeRouter);
server.use(postsRouter);

server.listen(8090, () => {
  console.log("Server listening.");
});
