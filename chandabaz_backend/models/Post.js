const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    type: { type: String, enum: ['image', 'video', 'pdf'], required: true },
    filename: { type: String },
    size: { type: Number },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    incidentDate: {
      type: Date,
      required: [true, 'Incident date is required'],
    },
    media: {
      type: [mediaSchema],
      validate: {
        validator: (v) => v.length <= 5,
        message: 'Cannot upload more than 5 media files per post',
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    tags: [{ type: String, trim: true }],
    viewCount: { type: Number, default: 0 },
    approvedAt: { type: Date, default: null },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

// Text index for search
postSchema.index({ title: 'text', description: 'text', location: 'text', tags: 'text' });
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ location: 1 });
postSchema.index({ author: 1 });

module.exports = mongoose.model('Post', postSchema);
