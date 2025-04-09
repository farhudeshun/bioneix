const expressValidator = require("express-validator");
const check = expressValidator.check;

module.exports = new (class {
  loginValidator() {
    return [
      check("email").isEmail().withMessage("Email is invalid"),
      check("password").not().isEmpty().withMessage("Password can't be empty"),
    ];
  }
})();
