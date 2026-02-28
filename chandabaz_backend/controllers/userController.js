const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Get current user's post stats
// @route   GET /api/users/me/stats
// @access  Private
exports.getMyStats = async (req, res, next) => {
  try {
    const author = req.user._id;
    const [total, pending, approved, rejected] = await Promise.all([
      Post.countDocuments({ author }),
      Post.countDocuments({ author, status: 'pending' }),
      Post.countDocuments({ author, status: 'approved' }),
      Post.countDocuments({ author, status: 'rejected' }),
    ]);

    res.json({
      success: true,
      data: { total, pending, approved, rejected },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user's name
// @route   PUT /api/users/me/name
// @access  Private
exports.updateMyName = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    if (email || phone) {
      return res.status(400).json({ success: false, message: 'Only name can be updated here' });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
