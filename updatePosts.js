const mongoose = require("mongoose");
const Post = require("./src/models/post"); // Make sure to adjust the path to your Post model

async function updatePosts() {
  try {
    await mongoose.connect("mongodb://localhost:27017/mydatabase", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Update all posts without an order field
    await Post.updateMany(
      { order: { $exists: false } }, // Only update posts without the order field
      { $set: { order: null } } // Set the order field to null for these posts
    );

    // Optionally: Update posts where `order` is explicitly set to something other than null
    // For example, to reset all order fields to null if necessary
    await Post.updateMany(
      { order: { $ne: null } }, // Find posts where order exists but isn't null
      { $set: { order: null } } // Set order to null for these posts
    );

    console.log("Posts updated successfully!");
  } catch (err) {
    console.error("Error updating posts:", err);
  } finally {
    mongoose.connection.close();
  }
}

updatePosts();
