// routes/search.js
const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // adjust path

// GET /search
router.get('/', async (req, res) => {
  const query = req.query.q || '';
  try {
    const results = await Product.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    });

    res.render('search', {
      query,
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
