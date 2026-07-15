const express = require("express");
const router = express.Router();

//import
const { createBlog } = require("../controllers/createblog");
const { createComment } = require("../controllers/commentController");
const { dummyLink, likePost, unlikePost } = require("../controllers/likeController");
const { createPost } = require("../controllers/postController");
const { getAllPosts } = require("../controllers/postcontroller");



//API routes
router.post("/createblog", createBlog);
router.post("/comment/create", createComment);
router.get("/dummyroute", dummyLink);
router.post("/post/create", createPost);
router.get("/post", getAllPosts);
router.post("/like/create", likePost);
router.post("/unlike", unlikePost)


module.exports = router;


