const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is missing in environment variables.');
    }

    if (mongoUri.includes('xxxxx')) {
      throw new Error(
        "MONGODB_URI contains a placeholder host ('xxxxx'). Replace it with your real MongoDB Atlas cluster host."
      );
    }

    const conn = await mongoose.connect(mongoUri, {
      autoIndex: process.env.MONGO_AUTOINDEX === 'true',
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    if (process.env.SYNC_INDEXES === 'true') {
      const Post = require('../models/Post');
      await Post.syncIndexes();
      console.log('MongoDB indexes synced for Post model.');
    }
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
