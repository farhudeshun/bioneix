// updateAdminPassword.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./src/models/user");

const updatePassword = async () => {
  try {
    // Connect to your MongoDB (make sure the database name is "mydatabase")
    await mongoose.connect("mongodb://localhost/mydatabase", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB for updating password");

    const saltRounds = 10;
    const plainPassword = "admin";

    // Generate a bcrypt hash for the plain password "admin"
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    console.log("Hashed Password:", hashedPassword);

    // Retrieve the admin user by email
    const existingUser = await User.findOne({ email: "admin@yahoo.com" });
    console.log("Existing user before update:", existingUser);

    if (!existingUser) {
      console.log("No user found with email admin@yahoo.com");
      process.exit();
    }

    // Update the user's password to the hashed version
    const updatedUser = await User.findOneAndUpdate(
      { email: "admin@yahoo.com" },
      { password: hashedPassword },
      { new: true }
    );
    console.log("Password updated successfully:", updatedUser);

    // Close the database connection
    await mongoose.connection.close();
    console.log("Connection closed.");
  } catch (error) {
    console.error("Error updating password:", error);
  }
};

updatePassword();
