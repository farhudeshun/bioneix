const express = require("express");
const router = express.Router();
const authRouter = require("../routes/auth");
const adminRouter = require("../routes/admin");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const error = require("../middlewares/error");
const postRoutes = require("./posts/post");

router.use(express.json());

router.use("/auth", authRouter);

router.use("/admin", isLoggedIn, isAdmin, adminRouter);

router.use(error);

router.use("/posts", postRoutes);

module.exports = router;
