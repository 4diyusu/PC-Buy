const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

// POST /register
router.post('/register', async (req, res) => {
  const {
    username,
    email,
    password,
    confirmPassword,
    phone,
    address1,
    address2,
    city,
    state,
    zip,
    country,
  } = req.body;

  // Trim values to avoid accidental spaces
  const cleanData = {
    username: username?.trim(),
    email: email?.trim().toLowerCase(),
    password,
    confirmPassword,
    phone: phone?.trim(),
    address1: address1?.trim(),
    address2: address2?.trim(),
    city: city?.trim(),
    state: state?.trim(),
    zip: zip?.trim(),
    country: country?.trim()
  };

  // Step 1: Validate required fields
  if (
    !cleanData.username || !cleanData.email || !cleanData.password || !cleanData.confirmPassword ||
    !cleanData.phone || !cleanData.address1 || !cleanData.city ||
    !cleanData.state || !cleanData.zip || !cleanData.country
  ) {
    console.warn('⚠️ Missing required fields');
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }

  if (cleanData.password !== cleanData.confirmPassword) {
    console.warn('⚠️ Passwords do not match');
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  try {
    // Step 2: Check if user already exists
    const existingUser = await User.findOne({ email: cleanData.email });
    if (existingUser) {
      console.warn('⚠️ Email already registered:', cleanData.email);
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    // Step 3: Hash password
    const hashedPassword = await bcrypt.hash(cleanData.password, 10);

    // Step 4: Create and save new user
    const newUser = new User({
      username: cleanData.username,
      email: cleanData.email,
      password: hashedPassword,
      phone: cleanData.phone,
      address: {
        address1: cleanData.address1,
        address2: cleanData.address2,
        city: cleanData.city,
        state: cleanData.state,
        zip: cleanData.zip,
        country: cleanData.country
      }
    });

    const savedUser = await newUser.save();
    console.log('✅ User registered:', savedUser.email);

    res.status(201).json({ success: true, message: 'User registered successfully.' });
  } catch (err) {
    console.error('❌ Registration failed:', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  try {
    // 1. Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // 3. Store session
    req.session.userId = user._id;
    req.session.username = user.username;

    console.log(`✅ Login successful for: ${user.username}`);
    res.status(200).json({ success: true, message: 'Login successful!' });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// GET /logout
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
