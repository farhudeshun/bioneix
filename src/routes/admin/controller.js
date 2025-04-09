const Post = require("../../models/post");
const User = require("../../models/user");

class AdminController {
  async dashboard(req, res) {
    try {
      const [postCount, userCount] = await Promise.all([
        Post.countDocuments(),
        User.countDocuments(),
      ]);

      res.status(200).json({
        message: "Admin Dashboard",
        stats: {
          totalPosts: postCount,
          totalUsers: userCount,
        },
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Dashboard error",
        error: error.message,
      });
    }
  }

  async createPost(req, res) {
    const { title, content, tags } = req.body;

    try {
      const newPost = new Post({
        title,
        content,
        tags,
        author: req.user._id,
      });

      await newPost.save();
      res.status(201).json({
        message: "Post created successfully",
        post: newPost,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating post",
        error: error.message,
      });
    }
  }

  async getAllPosts(req, res) {
    try {
      const posts = await Post.find()
        .populate("author", "name email")
        .sort({ createdAt: -1 });

      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching posts",
        error: error.message,
      });
    }
  }

  async updatePost(req, res) {
    const { id } = req.params;
    const updates = req.body;

    try {
      const post = await Post.findOne({
        _id: id,
        author: req.user._id,
      });

      if (!post) {
        return res.status(404).json({
          message: "Post not found or not authorized",
        });
      }

      const updatedPost = await Post.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      }).populate("author", "name email");

      res.status(200).json({
        message: "Post updated successfully",
        post: updatedPost,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating post",
        error: error.message,
      });
    }
  }

  async deletePost(req, res) {
    const { id } = req.params;

    try {
      const post = await Post.findOne({
        _id: id,
        author: req.user._id,
      });

      if (!post) {
        return res.status(404).json({
          message: "Post not found or not authorized",
        });
      }

      await Post.findByIdAndDelete(id);
      res.status(200).json({
        message: "Post deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting post",
        error: error.message,
      });
    }
  }
}

module.exports = new AdminController();
