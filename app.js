// ─────────────────────────────────────────────────────────────
// Imports & Config
// ─────────────────────────────────────────────────────────────
const express = require('express');
const path = require('path');
const open = require('open').default;
const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session');
const isAuthenticated = require('./middleware/auth');
const productRoutes = require('./routes/product');

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

// ─────────────────────────────────────────────────────────────
// Models
// ─────────────────────────────────────────────────────────────
const Product = require('./models/product');
const User = require('./models/user');

// ─────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const seedRoute = require('./routes/seed');
const cartRoutes = require('./routes/cart');

app.use(authRoutes);
app.use(seedRoute);
app.use('/cart', cartRoutes);

// ─────────────────────────────────────────────────────────────
// Pages
// ─────────────────────────────────────────────────────────────
app.get('/', async (req, res) => {
  try {
    const allProducts = await Product.find();
    const recommendedProducts = allProducts.slice(0, 4);
    const isLoggedIn = !!req.session.userId;
    const username = req.session.username || null;

    res.render('index', { allProducts, recommendedProducts, isLoggedIn, username });
  } catch (error) {
    console.error('Error loading homepage products:', error);
    res.status(500).send('Server Error');
  }
});

app.get('/product', async (req, res) => {
  try {
    const productId = req.query.id;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).send('Product not found');

    const productView = {
      _id: product._id,
      title: product.title,
      price: product.price,
      image: product.image || '/assets/default.png',
      shortDescription: product.description,
      inStock: product.instock,
      specs: product.fullSpecs
    };

    const isLoggedIn = !!req.session.userId;
    const username = req.session.username || null;

    res.render('product', { product: productView, isLoggedIn, username });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    const isLoggedIn = !!req.session.userId;
    const username = req.session.username || null;

    res.render('products', { products, isLoggedIn, username });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/register', (req, res) => {
  const isLoggedIn = !!req.session.userId;
  const username = req.session.username || null;
  res.render('register', { isLoggedIn, username });
});

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

app.use('/product', productRoutes); 


// ─────────────────────────────────────────────────────────────
// Server Start
// ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  open(`http://localhost:${PORT}`);
});
