const express = require('express');
const router = express.Router();
const User = require('../models/user');
const isAuthenticated = require('../middleware/auth');

// ──────────────────────────────
// GET /checkout — show order summary
// ──────────────────────────────
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).populate('cart.product');

    if (!user || !user.cart.length) {
      return res.render('checkout', {
        cartItems: [],
        subtotal: 0,
        shippingFee: 0,
        total: 0,
        isLoggedIn: true,
        username: req.session.username
      });
    }

    let subtotal = 0;
    const cartItems = user.cart.map(item => {
      const product = item.product;
      if (!product) return null;
      const quantity = item.quantity;
      const itemSubtotal = product.price * quantity;
      subtotal += itemSubtotal;
      return { product, quantity, subtotal: itemSubtotal };
    }).filter(Boolean);

    const shippingFee = cartItems.length ? 150 : 0;
    const total = subtotal + shippingFee;

    res.render('checkout', {
      cartItems,
      subtotal,
      shippingFee,
      total,
      isLoggedIn: true,
      username: req.session.username
    });

  } catch (err) {
    console.error('Error loading checkout page:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
