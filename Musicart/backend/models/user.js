const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  mobileNumber: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, 
    quantity: { type: Number },
    image: { type: String },
    price: { type: Number },
    name: { type: String }, // Add the name field
    color: { type: String } // Add the color field
  }],
});

userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    console.log('hashed password:', hashedPassword);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
