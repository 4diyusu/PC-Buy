const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

// ✅ Not used — redirect /login GET requests to homepage
router.get('/login', (req, res) => {
  return res.redirect('/');
});

// ✅ Register new user (traditional form submit)
router.post('/register', async (req, res) => {
  const {
    username, email, password, confirmPassword,
    phone, address1, address2, city, state, zip, country
  } = req.body;

  if (
    !username || !email || !password || !confirmPassword ||
    !phone || !address1 || !city || !state || !zip || !country
  ) {
    return res.status(400).send('Please fill in all required fields.');
  }

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match.');
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).send('Email is already registered.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      address: {
        address1,
        address2,
        city,
        state,
        zip,
        country
      }
    });

    await newUser.save();
    console.log('✅ User registered:', newUser.email);
    res.redirect('/');
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).send('Server error.');
  }
});

// ✅ Login via modal (expects JSON, returns JSON)
router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername }
      ]
    });

    if (!user) {
      console.log('❌ No such user');
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    req.session.userId = user._id;
    req.session.username = user.username;
    console.log(`✅ Login successful for ${user.username}`);
    return res.json({ success: true, message: 'Login successful' });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Logout route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Logout failed.');
    }
    res.redirect('/');
  });
});

module.exports = router;
