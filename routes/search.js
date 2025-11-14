// routes/search.js
const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // adjust path as needed

// GET /search
router.get('/', async (req, res) => {
  const query = req.query.q || '';
  const category = req.query.category || '';
  const brand = req.query.brand || '';

  let filter = {};

  if (query) {
    // Search by text
    filter.$or = [
      { title: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } }
    ];
  }

  if (category) {
    filter.category = { $regex: category, $options: 'i' };
  }

  if (brand) {
    filter.brand = { $regex: brand, $options: 'i' };
  }

  try {
    const results = await Product.find(filter);

    res.render('search', {
      query,
      category,
      brand,
      results,
      isLoggedIn: req.session.userId ? true : false,
      username: req.session.username || ''
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
