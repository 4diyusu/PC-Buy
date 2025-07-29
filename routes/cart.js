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
  if (!req.session.userId) {
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
    const user = await User.findById(req.session.userId);
    const product = await Product.findById(productId);
    if (!product) return res.status(404).send('Product not found');

    const existingItem = user.cart.find(item => item.product && item.product.toString() === productId.toString());
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
    let cartItems = [];
    let total = 0;
    const isLoggedIn = !!req.session.userId;
    const username = req.session.username || null;

    // GUEST USER
    if (!req.session.userId) {
      const guestCart = req.session.cart || [];

      for (const item of guestCart) {
        const product = await Product.findById(item.productId);
        if (product) {
          const quantity = Math.min(item.quantity, product.instock || 0);
          const subtotal = product.price * quantity;

          cartItems.push({
            product,
            quantity,
            subtotal,
            stock: product.instock || 0
          });

          total += subtotal;
        }
      }

      return res.render('cart', {
        cartItems,
        total,
        isLoggedIn,
        username,
        isEmpty: cartItems.length === 0
      });
    }

    // LOGGED IN USER
    const user = await User.findById(req.session.userId).populate('cart.product');
    for (const item of user.cart) {
      const product = item.product;
      if (!product) continue;

      const quantity = Math.min(item.quantity, product.instock || 0);
      const subtotal = product.price * quantity;

      cartItems.push({
        product,
        quantity,
        subtotal,
        stock: product.instock || 0
      });

      total += subtotal;
    }

    res.render('cart', {
      cartItems,
      total,
      isLoggedIn,
      username,
      isEmpty: cartItems.length === 0
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
  if (!req.session.userId) {
    if (req.session.cart) {
      const item = req.session.cart.find(i => i.productId === productId);
      if (item) item.quantity = parseInt(qty);
    }
    return res.redirect('/cart');
  }

  // LOGGED IN USER
  try {
    const user = await User.findById(req.session.userId);
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
  if (!req.session.userId) {
    if (req.session.cart) {
      req.session.cart = req.session.cart.filter(item => item.productId !== productId);
    }
    return res.redirect('/cart');
  }

  // LOGGED IN USER
  try {
    const user = await User.findById(req.session.userId);
    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    await user.save();

    res.redirect('/cart');
  } catch (err) {
    console.error('Error removing cart item:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
