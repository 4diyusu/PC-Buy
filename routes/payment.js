const express = require('express');
const router = express.Router();

// ──────────────────────────────
// Render Payment Page
// ──────────────────────────────
router.get('/', (req, res) => {
  res.render('payment', {
    isLoggedIn: !!req.session.userId,
    username: req.session.username || null
  });
});

// ──────────────────────────────
// Handle Payment Submission
// ──────────────────────────────
router.post('/', (req, res) => {
  const { paymentMethod } = req.body;

  // Safety check
  if (!paymentMethod) {
    return res.redirect('/payment');
  }

  // COD → pending approval
  if (paymentMethod === 'cod') {
    return res.redirect('/checkout-success?status=pending');
  }

  // GCash or Card → approved
  if (paymentMethod === 'gcash' || paymentMethod === 'card') {
    return res.redirect('/checkout-success?status=approved');
  }

  // Fallback if unknown method
  return res.redirect('/payment');
});

module.exports = router;
