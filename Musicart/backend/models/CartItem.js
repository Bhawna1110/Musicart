

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', 
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
    max: 8, 
  },
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;