// ─────────────────────────────────────────────────────────────
// Imports & Config
// ─────────────────────────────────────────────────────────────
const express = require('express');
const path = require('path');
const open = require('open').default;
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');
const isAuthenticated = require('./middleware/auth');

// Routes
const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');
const seedRoute = require('./routes/seed');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const paymentRoutes = require('./routes/payment'); // ✅ restored correctly here

// Models
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const Order = require('./models/order'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─────────────────────────────────────────────────────────────
// Database Connection
// ─────────────────────────────────────────────────────────────
const connectDB = require('./config/db');
connectDB();

// ─────────────────────────────────────────────────────────────
// Middleware & View Engine
// ─────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'pcbuy_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

// Global Middleware to inject session data to EJS
app.use((req, res, next) => {
  res.locals.isLoggedIn = !!req.session.userId;
  res.locals.username = req.session.username || null;
  next();
});

// ─────────────────────────────────────────────────────────────
// Routes Setup
// ─────────────────────────────────────────────────────────────
app.use(authRoutes);
app.use(seedRoute);
app.use('/product', productRoutes);
app.use('/cart', cartRoutes);
app.use('/checkout', isAuthenticated, checkoutRoutes);
app.use('/payment', isAuthenticated, paymentRoutes); // ✅ correct and clean

// ─────────────────────────────────────────────────────────────
// Pages
// ─────────────────────────────────────────────────────────────

// Home Page
app.get('/', async (req, res) => {
  try {
    const allProducts = await Product.find();
    const recommendedProducts = allProducts.slice(0, 4);

    res.render('index', {
      allProducts,
      recommendedProducts,
      isLoggedIn: !!req.session.userId,
      username: req.session.username || null
    });
  } catch (error) {
    console.error('Error loading homepage:', error);
    res.status(500).send('Server Error');
  }
});

// Product Details
app.get('/product', async (req, res) => {
  try {
    const productId = req.query.id;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).send('Product not found');

    res.render('product', {
      product: {
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.image || '/assets/default.png',
        shortDescription: product.description,
        instock: product.instock,
        specs: product.fullSpecs
      },
      isLoggedIn: !!req.session.userId,
      username: req.session.username || null
    });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).send('Server Error');
  }
});

// All Products Page
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products', {
      products,
      isLoggedIn: !!req.session.userId,
      username: req.session.username || null
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Server Error');
  }
});

// Register Page
app.get('/register', (req, res) => {
  res.render('register', {
    isLoggedIn: !!req.session.userId,
    username: req.session.username || null
  });
});

// Profile Page
app.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.redirect('/login');

    res.render('profile', {
      isLoggedIn: true,
      username: req.session.username,
      user
    });
  } catch (err) {
    console.error('Error loading profile:', err);
    res.status(500).send('Server Error');
  }
});

// ✅ Confirmed Order Page
app.get('/confirmed-order', isAuthenticated, (req, res) => {
  res.render('confirmed-order', {
    username: req.session.username,
    isLoggedIn: true
  });
});

// ─────────────────────────────────────────────────────────────
// Server Start
// ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  open(`http://localhost:${PORT}`);
});
