const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Add comment to a post
// @route   POST /api/comments/:postId
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const { content, isAnonymous } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Comment content is required' });
    }

    const post = await Post.findOne({ _id: req.params.postId, status: 'approved' });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found or not approved yet' });
    }

    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user._id,
      content: content.trim(),
      isAnonymous: isAnonymous === true || isAnonymous === 'true',
    });

    await comment.populate('author', 'name avatar');

    const safeComment = {
      ...comment.toObject(),
      author: comment.isAnonymous ? null : comment.toObject().author,
    };

    res.status(201).json({ success: true, data: safeComment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Public
exports.getComments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const post = await Post.findOne({ _id: req.params.postId, status: 'approved' });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const total = await Comment.countDocuments({ post: req.params.postId });
    const comments = await Comment.find({ post: req.params.postId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'name avatar')
      .lean();

    const safeComments = comments.map((c) => ({
      ...c,
      author: c.isAnonymous ? null : c.author,
    }));

    res.json({
      success: true,
      data: safeComments,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const isOwner = comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};
