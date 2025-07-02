// routes/seed.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/seed-user', async (req, res) => {
  try {
    const existing = await User.findOne({ email: 'admin@pcbuy.com' });
    if (existing) {
      return res.send('⚠️ Test user already exists.');
    }

    const testUser = new User({
      username: 'admin',
      email: 'admin@pcbuy.com',
      password: 'admin123',
      phone: '09123456789',
      address: {
        address1: '123 Test Street',
        address2: 'Floor 2',
        city: 'Quezon City',
        state: 'NCR',
        zip: '1100',
        country: 'Philippines'
      }
    });

    await testUser.save();
    res.send('Test user seeded!');
  } catch (err) {
    console.error('Error seeding test user:', err);
    res.status(500).send('Error seeding user.');
  }
});

module.exports = router;
