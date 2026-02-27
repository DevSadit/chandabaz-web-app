const express = require('express');
const router = express.Router();
const {
  getPendingPosts,
  getAllPosts,
  approvePost,
  rejectPost,
  deletePost,
  getUsers,
  toggleUserStatus,
  getStats,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

// All admin routes require authentication + admin role
router.use(protect, admin);

router.get('/stats', getStats);
router.get('/posts', getAllPosts);
router.get('/posts/pending', getPendingPosts);
router.put('/posts/:id/approve', approvePost);
router.put('/posts/:id/reject', rejectPost);
router.delete('/posts/:id', deletePost);
router.get('/users', getUsers);
router.put('/users/:id/toggle', toggleUserStatus);

module.exports = router;
