// ─────────────────────────────────────────────────────────────
// Imports & Config
// ─────────────────────────────────────────────────────────────
const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
const open = require('open').default;

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
app.get('/', (req, res) => {
  res.render('index'); // Ensure you have views/index.ejs or change this
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

// Individual product view
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
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
