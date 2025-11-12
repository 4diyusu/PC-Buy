// routes/hamburger/wishlist.js
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');

// GET: Wishlist(Coming Soon)
router.get('/', isAuthenticated, (req, res) => {
  res.render('hamburger/wishlist', {
    isLoggedIn: true,
    username: req.session.username || null
  });
});

module.exports = router;
