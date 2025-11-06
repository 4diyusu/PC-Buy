// routes/hamburger/transaction-history.js
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');

// GET: Transaction History (Coming Soon)
router.get('/', isAuthenticated, (req, res) => {
  res.render('hamburger/transaction-history', {
    isLoggedIn: true,
    username: req.session.username || null
  });
});

module.exports = router;
