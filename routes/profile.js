// routes/profile.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET: Profile Page
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.redirect('/login');

    res.render('profile', {
      isLoggedIn: true,
      username: req.session.username,
      user
    });
  } catch (err) {
    console.error('Error loading profile:', err);
    res.status(500).send('Server Error');
  }
});

// GET: Update Account Page
router.get('/update', async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.redirect('/login');

    res.render('updateAccount', {
      user,
      isLoggedIn: true,
      username: req.session.username
    });
  } catch (err) {
    console.error('Error loading update account page:', err);
    res.status(500).send('Server Error');
  }
});

// POST: Handle Account Update
router.post('/update', async (req, res) => {
  try {
    const { username, email, phone } = req.body;
    await User.findByIdAndUpdate(req.session.userId, { username, email, phone });
    res.redirect('/profile');
  } catch (err) {
    console.error('Error updating account:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
