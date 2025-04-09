const controller = require("./../controller");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

module.exports = new (class extends controller {
  async login(req, res) {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return this.response({
        res,
        code: 400,
        message: "User not found",
      });
    }

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return this.response({
        res,
        code: 400,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      process.env.jwt_key
    );

    this.response({
      res,
      message: "Successfully logged in",
      data: { token },
    });
  }
})();
