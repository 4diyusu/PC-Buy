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
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const paymentRoutes = require('./routes/payment');
const accountRoutes = require('./routes/account');
const transactionHistoryRoutes = require('./routes/transaction-history');
const helpcenterRoutes = require('./routes/help-center');
const trackanOrderRoutes = require('./routes/track-an-order');
const wishlistRoutes = require('./routes/wishlist');
const logoutRoute = require('./routes/logout');

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

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});


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
app.use('/product', productRoutes);
app.use('/cart', cartRoutes);
app.use('/checkout', isAuthenticated, checkoutRoutes);
app.use('/payment', isAuthenticated, paymentRoutes); 
app.use('/account', accountRoutes);
app.use('/transaction-history', transactionHistoryRoutes);
app.use('/help-center', helpcenterRoutes);
app.use('/track-an-order', trackanOrderRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/logout', logoutRoute);

// ─────────────────────────────────────────────────────────────
// Pages
// ─────────────────────────────────────────────────────────────

// Home Page
app.get('/', async (req, res) => {
  try {
    const allProducts = await Product.aggregate([{ $sample: { size: 20 } }]);
    const recommendedProducts = allProducts.slice(0, 8);

    res.render('index', {
      recommendedProducts,
      allProducts,
      isLoggedIn: !!req.session.userId,
      username: req.session.username || ''
    });
  } catch (err) {
    console.error(err);
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

// Confirmed Order Page
app.get('/confirmed-order', isAuthenticated, (req, res) => {
  res.render('confirmed-order', {
    username: req.session.username,
    isLoggedIn: true
  });
});

// Checkout Success Page
app.get('/checkout-success', (req, res) => {
  const status = req.query.status || 'approved'; // comes from payment.js redirect
  res.render('checkout-success', {
    isLoggedIn: !!req.session.userId,
    username: req.session.username || null,
    status
  });
});

// Search Page
app.get('/search', async (req, res) => {
  const query = req.query.q || '';
  const page = parseInt(req.query.page) || 1; // current page
  const limit = 10; // products per page
  const skip = (page - 1) * limit;

  try {
    // Get total count matching query
    const totalResults = await Product.countDocuments({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    });

    // Fetch paginated results
    const results = await Product.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    })
    .skip(skip)
    .limit(limit);

    const totalPages = Math.ceil(totalResults / limit);

    res.render('search', {
      query,
      results,
      page,
      totalPages,
      isLoggedIn: req.session.userId ? true : false,
      username: req.session.username || ''
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// ─────────────────────────────────────────────────────────────
// Server Start
// ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  open(`http://localhost:${PORT}`);
});
