// routes/hamburger/help-center.js
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');

// GET: Help Center (Coming Soon)
router.get('/', isAuthenticated, (req, res) => {
  res.render('hamburger/help-center', {
    isLoggedIn: true,
    username: req.session.username || null
  });
});

module.exports = router;
