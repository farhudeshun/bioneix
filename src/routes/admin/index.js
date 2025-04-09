const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { isLoggedIn, isAdmin } = require("../../middlewares/auth");

router.use(isLoggedIn, isAdmin);

router.get("/", controller.dashboard);

router.post("/posts", controller.createPost);
router.get("/posts", controller.getAllPosts);
router.put("/posts/:id", controller.updatePost);
router.delete("/posts/:id", controller.deletePost);

module.exports = router;
