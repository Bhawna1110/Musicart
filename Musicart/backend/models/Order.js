const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userFullName: String,
    items: [{
      productId: String,
      quantity: Number,
      image:String,
      price: Number,
      name:String,
      color:String,
    }],

    deliveryAddress: String,
    paymentMethod: String,
    orderTotal: Number,
  });

module.exports = mongoose.model('Order', orderSchema);
  