// models/CartItem.js

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
    max: 8, // Maximum quantity allowed per product
  },
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;