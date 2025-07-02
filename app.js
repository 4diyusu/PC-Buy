// ─────────────────────────────────────────────────────────────
// Imports & Config
// ─────────────────────────────────────────────────────────────
const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
const open = require('open').default;
const mongoose = require("mongoose");

// ─────────────────────────────────────────────────────────────
// MongoDB Connection
// ─────────────────────────────────────────────────────────────
const connectDB = require('./config/db');
connectDB();

// ─────────────────────────────────────────────────────────────
// App Settings
// ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// ─────────────────────────────────────────────────────────────
// Models
// ─────────────────────────────────────────────────────────────
const Product = require('./models/product');

// ─────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────

// Home page (placeholder)
app.get('/', async (req, res) => {
  try {
    const allProducts = await Product.find();
    const recommendedProducts = allProducts.slice(0, 4);

    res.render('index', { allProducts, recommendedProducts });
  } catch (error) {
    console.error('Error loading homepage products:', error);
    res.status(500).send('Server Error');
  }
});

//Products
app.get('/product', async (req, res) => {
  try {
    const productId = req.query.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).send('Product not found');

    const productView = {
      title: product.title,
      price: product.price,
      image: product.images?.[0] || '/assets/default.png',
      shortDescription: product.description,
      inStock: product.instock,
      specs: product.fullSpecs
    };

    res.render('product', { product: productView });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).send('Server Error');
  }
});


// Register page
app.get('/register', (req, res) => {
  res.render('register');
});

// List all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products', { products });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Server Error');
  }
});

// TEMP: Seed route (remove before production)
const seedRoute = require('./routes/seed');
app.use(seedRoute);

// ─────────────────────────────────────────────────────────────
// Server Start
// ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  open(`http://localhost:${PORT}`);
});
