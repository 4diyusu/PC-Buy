const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage });
const mongoose = require('mongoose');

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
    const { title, description, price, instock, fullSpecs } = req.body;

    const newProduct = new Product({
      title,
      description,
      price,
      instock: instock === 'true',
      fullSpecs,
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
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.warn(`Invalid product ID: ${id}`);
      return res.status(400).send('Invalid Product ID');
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).send('Product not found');

    const isLoggedIn = !!req.session.userId;
    const username = req.session.username || null;

    res.render('product', { product, isLoggedIn, username });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
