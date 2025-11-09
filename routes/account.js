// routes/account.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const isAuthenticated = require('../middleware/auth');

// GET: Render Update Account Page
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).lean();
    if (!user) return res.redirect('/login');

    // Handle flash messages
    const flash = req.session.flash;
    delete req.session.flash;

    res.render('hamburger/account-edit', {
      isLoggedIn: true,
      username: req.session.username,
      user,
      flash
    });
  } catch (error) {
    console.error('Error loading account page:', error);
    res.status(500).send('Server Error');
  }
});

// POST: Handle Update Submission
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    const {
      username,
      email,
      phone,
      address1,
      address2,
      city,
      state,
      zip,
      country,
      currentPassword,
      newPassword,
      confirmPassword
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.redirect('/login');

    // Check if email is being updated and unique
    if (email && email.toLowerCase() !== user.email) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        req.session.flash = { type: 'error', message: 'Email is already in use.' };
        return res.redirect('/account');
      }
    }

    // Update password if requested
    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        req.session.flash = { type: 'error', message: 'Enter your current password to change it.' };
        return res.redirect('/account');
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        req.session.flash = { type: 'error', message: 'Current password is incorrect.' };
        return res.redirect('/account');
      }

      if (newPassword !== confirmPassword) {
        req.session.flash = { type: 'error', message: 'Passwords do not match.' };
        return res.redirect('/account');
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
    }

    // Update other fields with trimming
    user.username = username?.trim() || user.username;
    user.email = email?.trim().toLowerCase() || user.email;
    user.phone = phone?.trim() || user.phone;

    // Ensure address object exists
    if (!user.address) user.address = {};

    user.address.address1 = address1?.trim() || '';
    user.address.address2 = address2?.trim() || '';
    user.address.city = city?.trim() || '';
    user.address.state = state?.trim() || '';
    user.address.zip = zip?.trim() || '';
    user.address.country = country?.trim() || '';

    await user.save();

    // Update session username
    req.session.username = user.username;
    req.session.flash = { type: 'success', message: 'Account updated successfully!' };
    res.redirect('/account');
  } catch (error) {
    console.error('Error updating account:', error);
    req.session.flash = { type: 'error', message: 'Something went wrong. Try again later.' };
    res.redirect('/account');
  }
});

module.exports = router;
