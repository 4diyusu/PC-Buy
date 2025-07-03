const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage });

const Product = require('../models/product');

// GET /product/add — Show form to add a product (admin use)
router.get('/add', (req, res) => {
  const isLoggedIn = !!req.session.userId;
  const username = req.session.username || null;
  res.render('addProduct', { isLoggedIn, username });
});

// POST /product/add — Save product to DB with optional image
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, instock, fullSpecs, recommended } = req.body;

    const newProduct = new Product({
      title,
      description,
      price,
      instock: instock === 'true',
      fullSpecs,
      recommended: recommended === 'true',
      image: req.file?.path || null, // Cloudinary image URL
    });

    await newProduct.save();
    res.redirect('/');
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).send('Internal Server Error');
  }
});

// GET /product/:id — View a single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');

    // Render view using product as-is; fallback logic is in EJS
    const isLoggedIn = !!req.session.userId;
    const username = req.session.username || null;

    res.render('product', { product, isLoggedIn, username });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
