const express = require('express');
const router = express.Router();
const User = require('../models/user');
const isAuthenticated = require('../middleware/auth');

// GET /checkout — show order summary
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).populate('cart.product');

    if (!user || user.cart.length === 0) {
      return res.render('checkout', {
        cartItems: [],
        subtotal: 0,
        shippingFee: 0,
        total: 0,
        isLoggedIn: true,
        username: req.session.username
      });
    }

    let cartItems = [];
    let subtotal = 0;

    for (const item of user.cart) {
      if (!item.product) continue;

      const quantity = Math.min(item.quantity, item.product.instock || 0);
      const itemSubtotal = item.product.price * quantity;

      subtotal += itemSubtotal;

      cartItems.push({
        product: item.product,
        quantity,
        subtotal: itemSubtotal
      });
    }

    const shippingFee = cartItems.length > 0 ? 150 : 0;
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

// POST /checkout — process order
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).populate('cart.product');

    for (const item of user.cart) {
      if (item.product) {
        item.product.instock -= item.quantity;
        await item.product.save();
      }
    }

    user.cart = [];
    await user.save();

    res.render('checkout-success', {
      isLoggedIn: true,
      username: req.session.username
    });
  } catch (err) {
    console.error('Error processing checkout:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
