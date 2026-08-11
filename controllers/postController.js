const Post = require('../models/Post');
const asyncHandler = require('../utils/asycHandler');

// ===== PUBLIC ROUTES =====
exports.getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate('author', 'username email').sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: posts.length, data: posts });
});

exports.getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username email');
  if (!post) {
    res.status(404);
    throw new Error('Post not found with this ID');
  }
  res.status(200).json({ success: true, data: post });
});

// ===== PROTECTED ROUTES (Ye functions EXACT honay chahiye) =====
exports.createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400);
    throw new Error('Please provide title and content');
  }
  const post = await Post.create({ title, content, author: req.user.userId });
  res.status(201).json({ success: true, message: 'Post created successfully', data: post });
});

exports.updatePost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  if (post.author.toString() !== req.user.userId) {
    res.status(403);
    throw new Error('You are not authorized to update this post');
  }
  post.title = title || post.title;
  post.content = content || post.content;
  await post.save();
  res.status(200).json({ success: true, message: 'Post updated successfully', data: post });
});

exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  if (post.author.toString() !== req.user.userId) {
    res.status(403);
    throw new Error('You are not authorized to delete this post');
  }
  await post.deleteOne();
  res.status(200).json({ success: true, message: 'Post deleted successfully', data: post });
});