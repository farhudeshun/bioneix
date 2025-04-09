const express = require("express");
const router = express.Router();
const PostController = require("../posts/postController");
const { isLoggedIn, isAdmin } = require("../../middlewares/auth");

router.post("/", isLoggedIn, isAdmin, PostController.createPost);
router.get("/", PostController.getAllPosts);
router.get("/:id", PostController.getPostById);
router.put("/:id", isLoggedIn, isAdmin, PostController.updatePost);
router.delete("/:id", isLoggedIn, isAdmin, PostController.deletePost);

module.exports = router;
