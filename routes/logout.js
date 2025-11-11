// routes/logout.js
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Server error during logout');
    }

    // Clear session cookie
    res.clearCookie('connect.sid', { path: '/' });
    
    // Redirect to home page
    res.redirect('/');
  });
});

module.exports = router;
