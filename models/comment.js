const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const commentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      min: 3,
      max: 160,
      required: true,
    },
    position: {
      type: String,
      trim: true,
    },
    point: {
      type: Number,
      default: 3,
    },
    content: {
      type: String,
      max: 20000,
      required: true,
    },
    company: [{ type: ObjectId, ref: 'Company', required: true }],
    likes: [
      {
        name: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    dislike: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    reply: [
      {
        name: {
          type: String,
        },
        content: {
          type: String,
          max: 1000,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    violate: [
      {
        content: {
          type: String,
          max: 1000,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
