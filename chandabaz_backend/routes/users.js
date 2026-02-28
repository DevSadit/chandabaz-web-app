const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMyStats, updateMyName } = require('../controllers/userController');

router.get('/me/stats', protect, getMyStats);
router.put('/me/name', protect, updateMyName);

module.exports = router;
