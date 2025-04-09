const mongoose = require("mongoose");
const Post = require("../../models/post");
const User = require("../../models/user");

module.exports = {
  async createPost(req, res) {
    try {
      const { title, description, keywords, order, thumbnail } = req.body;
      const userId = req.user.id;

      const post = await Post.create({
        title,
        description,
        keywords,
        order,
        thumbnail,
        userId,
      });

      return res.status(201).json({
        message: "Post created successfully",
        post,
      });
    } catch (error) {
      console.error("Error creating post:", error);
      return res
        .status(500)
        .json({ message: "Error creating post", error: error.message });
    }
  },

  async getAllPosts(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const allPosts = await Post.find({}).lean();

      const orderedMap = new Map();
      const unordered = [];

      for (const post of allPosts) {
        if (
          post.order !== null &&
          post.order !== undefined &&
          Number.isInteger(post.order) &&
          post.order > 0
        ) {
          orderedMap.set(post.order - 1, post);
        } else {
          unordered.push(post);
        }
      }

      unordered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      const combined = [];
      let unorderedIndex = 0;

      for (let i = 0; i < allPosts.length; i++) {
        if (orderedMap.has(i)) {
          combined.push(orderedMap.get(i));
        } else if (unorderedIndex < unordered.length) {
          combined.push(unordered[unorderedIndex++]);
        }
      }

      const paginated = combined.slice(skip, skip + parseInt(limit));
      const totalPosts = combined.length;

      return res.status(200).json({
        posts: paginated,
        pagination: {
          totalPosts,
          totalPages: Math.ceil(totalPosts / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      return res
        .status(500)
        .json({ message: "Error fetching posts", error: error.message });
    }
  },

  async getPostById(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid post ID format" });
      }

      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      return res
        .status(500)
        .json({ message: "Error fetching post", error: error.message });
    }
  },

  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { title, description, keywords, order, thumbnail } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid post ID format" });
      }

      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (title) post.title = title;
      if (description) post.description = description;
      if (keywords) post.keywords = keywords;
      if (order !== undefined) post.order = order;
      if (thumbnail) post.thumbnail = thumbnail;

      await post.save();

      return res.status(200).json({
        message: "Post updated successfully",
        post,
      });
    } catch (error) {
      console.error("Error updating post:", error);
      return res
        .status(500)
        .json({ message: "Error updating post", error: error.message });
    }
  },

  async deletePost(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid post ID format" });
      }

      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      await post.remove();

      return res.status(204).json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      return res
        .status(500)
        .json({ message: "Error deleting post", error: error.message });
    }
  },
};
