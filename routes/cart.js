const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product = require('../models/product');
const { addOrUpdateCart } = require('../utils/cart');

// POST /cart/add/:id
router.post('/add/:id', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const user = await User.findById(req.session.user._id);
  if (!user) return res.redirect('/login');

  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).send('Product not found.');

  addOrUpdateCart(user.cart, productId);
  await user.save();

  res.redirect('/cart');
});

// GET /cart
router.get('/', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  try {
    const user = await User.findById(req.session.userId).populate('cart.productId');

    const cartItems = user.cart.map(item => {
      const product = item.productId;
      return {
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.images?.[0] || '/assets/default.png',
        quantity: item.quantity,
        subtotal: product.price * item.quantity
      };
    });

    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    res.render('cart', {
      cartItems,
      total,
      isLoggedIn: true,
      username: req.session.username
    });
  } catch (err) {
    console.error('Error loading cart:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;