const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Product = require('./models/Product');
const CartItem = require('./models/CartItem');
const Order=require("./models/Order")
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
const allowedOrigin = 'https://sumanbhawna11-gmail-com-cuvette-final-evaluation-august1.vercel.app';



app.use(express.json());


const MONGODB_URL = 'mongodb+srv://sumanbhawna11:DNtlVxI24qwg5SNs@cluster0.klnkrie.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
  app.use(cors(allowedOrigin));
 
  app.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.get('/product/:productId', async (req, res) => {
    try {
      const { productId } = req.params;
      console.log(productId)
      const product = await Product.findById(productId);
      res.json(product);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  app.post('/add-to-cart/:productId', async (req, res) => {
    try {
      const { productId } = req.params;
      const token = req.headers.authorization;
      const decodedToken = jwt.verify(token, 'rajna2378999##@679789fvg');
      const userEmail = decodedToken.email;
      let user = await User.findOne({ email: userEmail });
      console.log(productId)
      console.log(user)
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      let product = await Product.findById(productId).exec();
  
      console.log("product", product)
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      let cartItem = user.cart.find(item => {
        console.log(productId,item.productId )
        return item.productId === productId
      });
  
      if (cartItem) {
        if (cartItem.quantity < 8) {
          cartItem.quantity += 1
          console.log("cartItemm", cartItem)
          console.log("quntity",cartItem.quantity)
          for (let i = 0; i < user.cart.length; i++) {
            if (user.cart[i].productId==productId){
              let spliced = user.cart.splice(i, 1);
              console.log(spliced)
            }
          }
          const cart=[...user.cart,cartItem]
          console.log("cart-----------",cart)
  
          await User.updateOne({_id:user.id},{$set:{cart:cart}})
  
          
          
          console.log("userr", user)
        return res.status(200).json({ message: 'Product added to cart successfully' });
        } else {
          return res.status(200).json({ message: 'Can not increase quantity more than 8' });
        }
      } else {
  
        console.log("cartItem", cartItem)
        console.log(productId)
        let newCart = {
          productId,
          quantity: 1,
          image: product.image,
          name: product.name,
          color: product.color,
          price: product.price
        }
        console.log("newCart",newCart)
        const cart=[...user.cart,newCart]
        console.log("crt",cart)
      console.log("user", user)
  
      
        console.log("added irem to cart",user.cart)
  
       
        await User.updateOne({_id:user.id},{$set:{cart:cart}})
  
    
  
        return res.status(200).json({ message: 'Product added to cart successfully' });
      }
      
    } catch (error) {
      console.error('Error adding product to cart:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });  

app.get('/cart/count', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, 'rajna2378999##@679789fvg');
    const userEmail = decodedToken.email;

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let totalCount = 0;

    user.cart.forEach(item => {
      totalCount += item.quantity;
    });

    res.status(200).json({ count: totalCount });
  } catch (error) {
    console.error('Error fetching cart item count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/cart', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, 'rajna2378999##@679789fvg');
    const userEmail = decodedToken.email;

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/register', async (req, res) => {
  try {
    console.log('Received registration request:', req.body);
    const { username, mobileNumber, email, password } = req.body;
    const user = new User({ username, mobileNumber, email, password });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password)
    const user = await User.findOne({ email });
    console.log("user",user)

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Stored hashed password:', user.password);
    console.log('Is password valid?', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email, username: user.username }, 'rajna2378999##@679789fvg', {
      expiresIn: '10h',
    });
    console.log('Generated token:', token);

    res.status(200).json({ message: 'Login successful', username: user.username, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/user-data', async (req, res) => {
  try {

    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, 'rajna2378999##@679789fvg');
    console.log('decoded token:', decodedToken);
    const userEmail = decodedToken.email;
    console.log('userEmail:', userEmail);
    const userName = decodedToken.username;
    console.log('userName:', userName);



    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }


    const userData = {
      email: user.email,
      username: user.username, 
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/orders', async (req, res) => {
  try {

    const { userFullName, cartItems, deliveryAddress, paymentMethod, orderTotal } = req.body;
    console.log("-------------")
console.log( userFullName, cartItems, deliveryAddress, paymentMethod, orderTotal)

    const order = new Order({
      user: req.user, // Assuming you have middleware to authenticate users
      items: cartItems,
      deliveryAddress,
      paymentMethod,
      orderTotal,
    });

    console.log("order",order)
    await order.save();

    res.status(201).json({ orderId: order._id, message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET endpoint to fetch all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
