const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Get all pending posts
// @route   GET /api/admin/posts/pending
// @access  Admin
exports.getPendingPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await Post.countDocuments({ status: 'pending' });
    const posts = await Post.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'name email phone');

    res.json({
      success: true,
      data: posts,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts (any status) for admin review
// @route   GET /api/admin/posts
// @access  Admin
exports.getAllPosts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status;
    }

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'name email phone');

    res.json({
      success: true,
      data: posts,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a post
// @route   PUT /api/admin/posts/:id/approve
// @access  Admin
exports.approvePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.status = 'approved';
    post.approvedAt = new Date();
    post.approvedBy = req.user._id;
    post.rejectionReason = null;
    await post.save();

    res.json({ success: true, message: 'Post approved', data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a post
// @route   PUT /api/admin/posts/:id/reject
// @access  Admin
exports.rejectPost = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.status = 'rejected';
    post.rejectionReason = reason || 'Content does not meet community guidelines';
    await post.save();

    res.json({ success: true, message: 'Post rejected', data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin delete a post
// @route   DELETE /api/admin/posts/:id
// @access  Admin
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, message: 'Post permanently deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await User.countDocuments();
    const users = await User.find().sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));

    res.json({
      success: true,
      data: users,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle
// @access  Admin
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot deactivate an admin account' });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
exports.getStats = async (req, res, next) => {
  try {
    const [totalPosts, pendingPosts, approvedPosts, rejectedPosts, totalUsers] = await Promise.all([
      Post.countDocuments(),
      Post.countDocuments({ status: 'pending' }),
      Post.countDocuments({ status: 'approved' }),
      Post.countDocuments({ status: 'rejected' }),
      User.countDocuments({ role: 'user' }),
    ]);

    res.json({
      success: true,
      data: { totalPosts, pendingPosts, approvedPosts, rejectedPosts, totalUsers },
    });
  } catch (error) {
    next(error);
  }
};
