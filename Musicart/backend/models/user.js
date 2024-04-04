const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  mobileNumber: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  cart: [{
    productId: { type: String }, 
    quantity: { type: Number },
    image: { type: String },
    price: { type: Number },
    name: { type: String }, 
    color: { type: String } 
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
