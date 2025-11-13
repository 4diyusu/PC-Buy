const express = require('express');
const router = express.Router();
const User = require('../models/user');
const isAuthenticated = require('../middleware/auth');

// ──────────────────────────────
// GET /payment — show payment selection
// ──────────────────────────────
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).populate('cart.product');

    let cartItems = [];
    let total = 0;

    if (user && user.cart.length) {
      cartItems = user.cart.map(item => {
        const product = item.product;
        if (!product) return null;
        const quantity = item.quantity;
        const subtotal = product.price * quantity;
        total += subtotal;
        return { product, quantity, subtotal };
      }).filter(Boolean);
    }

    res.render('payment', {
      isLoggedIn: true,
      username: req.session.username,
      cartItems,
      total
    });
  } catch (err) {
    console.error('Error loading payment page:', err);
    res.status(500).send('Server Error');
  }
});

// ──────────────────────────────
// POST /payment — handle payment submission
// ──────────────────────────────
router.post('/', isAuthenticated, async (req, res) => {
  const { paymentMethod } = req.body;

  if (!paymentMethod) return res.redirect('/payment');

  try {
    const user = await User.findById(req.session.userId);

    // Clear the cart after payment
    user.cart = [];
    await user.save();

    // Render success page
    res.render('checkout-success', {
      isLoggedIn: true,
      username: req.session.username,
      status: paymentMethod === 'cod' ? 'pending' : 'approved'
    });

  } catch (err) {
    console.error('Payment processing error:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
