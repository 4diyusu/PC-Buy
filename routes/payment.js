// routes/payment.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const cart = req.session.cart || {
    items: [],
    totalPrice: 0,
    totalQuantity: 0,
  };

  res.render('payment', { cart });
});

router.post('/', (req, res) => {
  const cart = req.session.cart || {
    items: [],
    totalPrice: 0,
    totalQuantity: 0,
  };

  // Here, simulate a successful payment and redirect to checkout
  res.redirect('/checkout');
});

module.exports = router;
