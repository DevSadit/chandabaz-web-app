const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = cloudinaryStorage({
  cloudinary,
  params: (req, file, cb) => {
    let resourceType = 'auto';
    let folder = 'chandabaz/media';

    if (file.mimetype.startsWith('image/')) {
      folder = 'chandabaz/images';
      resourceType = 'image';
    } else if (file.mimetype.startsWith('video/')) {
      folder = 'chandabaz/videos';
      resourceType = 'video';
    } else if (file.mimetype === 'application/pdf') {
      folder = 'chandabaz/documents';
      resourceType = 'raw';
    }

    cb(undefined, {
      folder,
      resource_type: resourceType,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'pdf'],
      transformation:
        resourceType === 'image'
          ? [{ width: 1920, height: 1080, crop: 'limit', quality: 'auto:good' }]
          : undefined,
    });
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'video/avi',
    'application/pdf',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not supported.`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 5, // max 5 files
  },
});

module.exports = { cloudinary: cloudinary.v2, upload };
