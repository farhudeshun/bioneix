const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost:27017/myProject")
    .then(() => console.log("✅ MongoDB connected successfully!"))
    .catch((err) => {
      console.error("❌ Database connection failed:", err.message);
      process.exit(1);
    });
};
