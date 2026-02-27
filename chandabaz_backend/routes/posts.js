const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPost,
  deletePost,
  getMyPosts,
} = require('../controllers/postController');
const { protect, optionalAuth } = require('../middleware/auth');
const handleUpload = require('../middleware/upload');

// Public
router.get('/', optionalAuth, getPosts);
router.get('/my', protect, getMyPosts);
router.get('/:id', optionalAuth, getPost);

// Private
router.post('/', protect, handleUpload, createPost);
router.delete('/:id', protect, deletePost);

module.exports = router;
