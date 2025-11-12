// routes/hamburger/track-an-order.js
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');

// GET: Track an Order (Coming Soon)
router.get('/', isAuthenticated, (req, res) => {
  res.render('hamburger/track-an-order', {
    isLoggedIn: true,
    username: req.session.username || null
  });
});

module.exports = router;
