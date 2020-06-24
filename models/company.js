const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: true,
    },
    type: {
      type: Number,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 1,
    },
    view: {
      type: Number,
      default: 0,
    },
    love: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
