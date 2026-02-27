const Post = require('../models/Post');

// Helper to detect media type from mimetype
const getMediaType = (mimetype) => {
  if (!mimetype) return 'image';
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype === 'application/pdf') return 'pdf';
  return 'image';
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res, next) => {
  try {
    const { title, description, location, incidentDate, isAnonymous, tags } = req.body;

    if (!title || !description || !location || !incidentDate) {
      return res.status(400).json({ success: false, message: 'Title, description, location, and date are required' });
    }

    // Process uploaded files from multer/cloudinary and normalize field names.
    const media = (req.files || [])
      .map((file) => {
        const fileUrl = file.path || file.secure_url || file.url;
        const publicId = file.filename || file.public_id;
        const type =
          file.resource_type === 'video'
            ? 'video'
            : file.resource_type === 'raw'
              ? 'pdf'
              : getMediaType(file.mimetype);

        if (!fileUrl) return null;

        return {
          url: fileUrl,
          publicId,
          type,
          filename: file.originalname || file.display_name || publicId,
          size: file.size || file.bytes,
        };
      })
      .filter(Boolean);

    // If files were uploaded but none produced valid URLs, fail with a clear message.
    if ((req.files || []).length > 0 && media.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Uploaded files were received but no valid media URL was returned by storage.',
      });
    }

    const post = await Post.create({
      title,
      description,
      location,
      incidentDate: new Date(incidentDate),
      isAnonymous: isAnonymous === 'true' || isAnonymous === true,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : [],
      media,
      author: req.user._id,
      status: 'pending',
    });

    await post.populate('author', 'name avatar');

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all approved posts (with search/filter)
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res, next) => {
  try {
    const { search, location, mediaType, startDate, endDate, page = 1, limit = 12 } = req.query;

    const filter = { status: 'approved' };

    // Full-text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Location filter (case-insensitive partial match)
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Media type filter
    if (mediaType && ['image', 'video', 'pdf'].includes(mediaType)) {
      filter['media.type'] = mediaType;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.incidentDate = {};
      if (startDate) filter.incidentDate.$gte = new Date(startDate);
      if (endDate) filter.incidentDate.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Post.countDocuments(filter);

    const posts = await Post.find(filter)
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'name avatar')
      .lean();

    // Strip author details for anonymous posts
    const safePosts = posts.map((p) => ({
      ...p,
      author: p.isAnonymous ? null : p.author,
    }));

    res.json({
      success: true,
      data: safePosts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, status: 'approved' })
      .populate('author', 'name avatar')
      .lean();

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Increment view count
    await Post.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

    // Strip author if anonymous
    if (post.isAnonymous) post.author = null;

    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete own post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts by current user
// @route   GET /api/posts/my
// @access  Private
exports.getMyPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await Post.countDocuments({ author: req.user._id });
    const posts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: posts,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};
