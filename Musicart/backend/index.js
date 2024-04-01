const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Product = require('./models/Product');
const CartItem = require('./models/CartItem');
const Feedback = require('./models/Feedback'); // Import the Feedback model

const app = express();

const allowedOrigin = 'http://localhost:3001';

app.use(express.json());

const MONGODB_URL = 'mongodb+srv://sumanbhawna11:DNtlVxI24qwg5SNs@cluster0.klnkrie.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});


app.use(cors(allowedOrigin));
// Route to fetch all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ----------------------------
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

    let cartItem = user.cart.find(item => item.productId === productId);

    if (cartItem) {
      if (cartItem.quantity < 8) {
        cartItem.quantity += 1
        console.log("cartItemm", cartItem)
      } else {
        return res.status(200).json({ message: 'Can not increase quantity more than 8' });
      }
    } else {

      console.log("cartItem", cartItem)

      let newCart = {
        productId,
        quantity: 1,
        image: product.image,
        name: product.name,
        color: product.color,
        price: product.price
      }

      user.cart.push(newCart)
    }
    await user.save()
    console.log("user", user)

    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// app.get('/cart', async (req, res) => {
//   try {
//     const token = req.headers.authorization;
//     const decodedToken = jwt.verify(token, 'rajna2378999##@679789fvg');
//     const userEmail = decodedToken.email;

//     const user = await User.findOne({ email: userEmail }).populate('cart.product');

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.status(200).json(user.cart);
//   } catch (error) {
//     console.error('Error fetching cart:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


app.get('/cart/count', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, 'rajna2378999##@679789fvg');
    const userEmail = decodedToken.email;

    const user = await User.findOne({ email: userEmail }).populate('cart.product');

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

    const user = await User.findOne({ email: userEmail }).populate('cart.product');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// -------------------------------


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
    const user = await User.findOne({ email });

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
      expiresIn: '1h',
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
    // Get the user's email from the decoded token
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, 'rajna2378999##@679789fvg');
    console.log('decoded token:', decodedToken);
    const userEmail = decodedToken.email;
    console.log('userEmail:', userEmail);
    const userName = decodedToken.username;
    console.log('userName:', userName);


    // Fetch user data based on the email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // You can customize the data you want to send to the frontend
    const userData = {
      email: user.email,
      username: user.username, // Add the 'name' property
      // Add other user data fields as needed
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error(error);
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
