const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product = require('../models/product');

// -------------------------
// POST /cart/add/:id
// -------------------------
router.post('/add/:id', async (req, res) => {
  const productId = req.params.id;

  // GUEST USER
  if (!req.session.user) {
    req.session.cart = req.session.cart || [];

    const existingItem = req.session.cart.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      req.session.cart.push({ productId, quantity: 1 });
    }

    return res.redirect('/cart');
  }

  // LOGGED IN USER
  try {
    const user = await User.findById(req.session.user._id);
    const product = await Product.findById(productId);
    if (!product) return res.status(404).send('Product not found');

    const existingItem = user.cart.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();
    res.redirect('/cart');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// -------------------------
// GET /cart
// -------------------------
router.get('/', async (req, res) => {
  try {
    // GUEST USER
    if (!req.session.user) {
      const guestCart = req.session.cart || [];
      const populatedItems = [];

      for (const item of guestCart) {
        const product = await Product.findById(item.productId);
        if (product) {
          populatedItems.push({
            product,
            quantity: item.quantity,
            subtotal: product.price * item.quantity
          });
        }
      }

      const total = populatedItems.reduce((sum, item) => sum + item.subtotal, 0);

      return res.render('cart', {
        cartItems: populatedItems,
        total,
        isLoggedIn: false,
        username: null
      });
    }

    // LOGGED IN USER
    const user = await User.findById(req.session.user._id).populate('cart.product');
    const cartItems = user.cart.map(item => {
      const product = item.product;
      return {
        product,
        quantity: item.quantity,
        subtotal: product.price * item.quantity
      };
    });

    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    res.render('cart', {
      cartItems,
      total,
      isLoggedIn: true,
      username: user.username
    });
  } catch (err) {
    console.error('Error loading cart:', err);
    res.status(500).send('Server Error');
  }
});

// -------------------------
// POST /cart/update/:id
// -------------------------
router.post('/update/:id', async (req, res) => {
  const productId = req.params.id;
  const { qty } = req.body;

  // GUEST USER
  if (!req.session.user) {
    if (req.session.cart) {
      const item = req.session.cart.find(i => i.productId === productId);
      if (item) item.quantity = parseInt(qty);
    }
    return res.redirect('/cart');
  }

  // LOGGED IN USER
  try {
    const user = await User.findById(req.session.user._id);
    const cartItem = user.cart.find(item => item.product.toString() === productId);
    if (!cartItem) return res.status(404).send('Item not in cart.');

    cartItem.quantity = parseInt(qty);
    await user.save();

    res.redirect('/cart');
  } catch (err) {
    console.error('Error updating cart item:', err);
    res.status(500).send('Server Error');
  }
});

// -------------------------
// POST /cart/remove/:id
// -------------------------
router.post('/remove/:id', async (req, res) => {
  const productId = req.params.id;

  // GUEST USER
  if (!req.session.user) {
    if (req.session.cart) {
      req.session.cart = req.session.cart.filter(item => item.productId !== productId);
    }
    return res.redirect('/cart');
  }

  // LOGGED IN USER
  try {
    const user = await User.findById(req.session.user._id);
    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    await user.save();

    res.redirect('/cart');
  } catch (err) {
    console.error('Error removing cart item:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
