const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      min: 3,
      max: 160,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    reason: {
      type: String,
    },
    content: {
      type: String,
      max: 1000,
      required: true,
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);
