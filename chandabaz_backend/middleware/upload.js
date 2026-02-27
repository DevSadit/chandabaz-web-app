const { upload } = require('../config/cloudinary');

// Middleware for uploading up to 5 media files under the field name "media"
const uploadMedia = upload.array('media', 5);

const handleUpload = (req, res, next) => {
  uploadMedia(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large. Maximum size is 50MB.' });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ success: false, message: 'Too many files. Maximum 5 files allowed.' });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

module.exports = handleUpload;
