const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: { type: String },
  about: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },

  ratings: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  },

  type: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },

  available: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  image1: {
    type: String,
    required: true
  },
  image2: {
    type: String,
    required: true
  },
  image3: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);
