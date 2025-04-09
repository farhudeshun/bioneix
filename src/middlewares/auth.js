const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/user");

async function isLoggedIn(req, res, next) {
  console.log("Request headers:", req.headers);

  const token = req.header("jwt_key");
  if (!token) {
    console.error("No token provided in jwt_key header.");
    return res.status(401).send("Access denied");
  }

  try {
    const decoded = jwt.verify(token, process.env.jwt_key);
    console.log("Decoded token payload:", decoded);

    const user = await User.findById(decoded._id);
    if (!user) {
      console.error("User not found for token _id:", decoded._id);
      return res.status(401).send("User not found");
    }

    req.user = user;
    next();
  } catch (ex) {
    console.error("Token verification error:", ex);
    return res.status(400).send("Invalid token");
  }
}

async function isAdmin(req, res, next) {
  if (!req.user) {
    console.error("User object missing in isAdmin middleware");
    return res.status(400).send("User not authenticated");
  }

  console.log("Admin check passed for user:", req.user.email);

  next();
}

module.exports = {
  isLoggedIn,
  isAdmin,
};
