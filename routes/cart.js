// ─────────────────────────────────────────────────────────────
// Imports
// ─────────────────────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product = require('../models/product');

// ─────────────────────────────────────────────────────────────
// POST /cart/add/:id → Add product to cart
// ─────────────────────────────────────────────────────────────
router.post('/add/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    // If user not logged in, use session cart
    if (!req.session.userId) {
      req.session.cart = req.session.cart || [];
      const existingItem = req.session.cart.find(item => item.productId === productId);

      if (existingItem) existingItem.quantity += 1;
      else req.session.cart.push({ productId, quantity: 1 });

      return res.redirect('/cart');
    }

    // Logged-in user
    const user = await User.findById(req.session.userId);
    const product = await Product.findById(productId);
    if (!product) return res.status(404).send('Product not found');

    const existingItem = user.cart.find(
      item => item.product && item.product.toString() === productId.toString()
    );

    if (existingItem) existingItem.quantity += 1;
    else user.cart.push({ product: productId, quantity: 1 });

    await user.save();
    res.redirect('/cart');
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).send('Server error');
  }
});

// ─────────────────────────────────────────────────────────────
// GET /cart → Display cart items
// ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    let cartItems = [];
    let total = 0;
    const isLoggedIn = !!req.session.userId;
    const username = req.session.username || null;

    if (!req.session.userId) {
      // Guest cart
      const guestCart = req.session.cart || [];

      for (const item of guestCart) {
        const product = await Product.findById(item.productId);
        if (product) {
          const quantity = Math.min(item.quantity, product.instock || 0);
          const subtotal = product.price * quantity;

          cartItems.push({ product, quantity, subtotal });
          total += subtotal;
        }
      }
    } else {
      // Logged-in user cart
      const user = await User.findById(req.session.userId).populate('cart.product');

      for (const item of user.cart) {
        const product = item.product;
        if (!product) continue;

        const quantity = Math.min(item.quantity, product.instock || 0);
        const subtotal = product.price * quantity;

        cartItems.push({ product, quantity, subtotal });
        total += subtotal;
      }
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

// ─────────────────────────────────────────────────────────────
// POST /cart/update/:id → Update quantity
// ─────────────────────────────────────────────────────────────
router.post('/update/:id', async (req, res) => {
  const productId = req.params.id;
  const qty = parseInt(req.body.qty);

  try {
    if (!req.session.userId) {
      // Guest cart
      req.session.cart = req.session.cart || [];
      const item = req.session.cart.find(i => i.productId === productId);
      if (!item) return res.status(404).json({ success: false, message: 'Product not in cart' });

      item.quantity = qty;

      const product = await Product.findById(productId);
      const updatedSubtotal = product.price * qty;

      // Recalculate total
      let total = 0;
      for (const i of req.session.cart) {
        const p = await Product.findById(i.productId);
        total += p.price * i.quantity;
      }

      return res.json({ success: true, updatedSubtotal, total });
    }

    // Logged-in user
    const user = await User.findById(req.session.userId).populate('cart.product');
    const item = user.cart.find(i => i.product && i.product._id.toString() === productId);

    if (!item) return res.status(404).json({ success: false, message: 'Product not in cart' });

    item.quantity = qty;
    await user.save();

    const updatedSubtotal = item.product.price * qty;
    const total = user.cart.reduce(
      (sum, i) => sum + (i.product ? i.product.price * i.quantity : 0),
      0
    );

    return res.json({ success: true, updatedSubtotal, total });
  } catch (err) {
    console.error('Error updating cart item:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /cart/remove/:id → Remove item
// ─────────────────────────────────────────────────────────────
router.post('/remove/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    if (!req.session.userId) {
      // Guest cart
      if (req.session.cart) {
        req.session.cart = req.session.cart.filter(item => item.productId !== productId);
      }
      return res.redirect('/cart');
    }

    // Logged-in user
    const user = await User.findById(req.session.userId);
    user.cart = user.cart.filter(
      item => item.product && item.product.toString() !== productId.toString()
    );
    await user.save();

    res.redirect('/cart');
  } catch (err) {
    console.error('Error removing cart item:', err);
    res.status(500).send('Server Error');
  }
});

// ─────────────────────────────────────────────────────────────
// POST /cart/payment → Proceed to payment summary
// ─────────────────────────────────────────────────────────────
router.post('/payment', async (req, res) => {
  try {
    const { total } = req.body;
    const isLoggedIn = !!req.session.userId;
    const username = req.session.username || null;
    let cartItems = [];

    if (req.session.userId) {
      // Logged-in user
      const user = await User.findById(req.session.userId).populate('cart.product');
      cartItems = user.cart.map(item => ({
        product: item.product,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity
      }));
    } else {
      // Guest user
      const guestCart = req.session.cart || [];
      for (const item of guestCart) {
        const product = await Product.findById(item.productId);
        if (product) {
          cartItems.push({
            product,
            quantity: item.quantity,
            subtotal: product.price * item.quantity
          });
        }
      }
    }

    // Render the payment page (invoice-like summary)
    res.render('payment', { cartItems, total, isLoggedIn, username });
  } catch (err) {
    console.error('Error loading payment page:', err);
    res.status(500).send('Server Error');
  }
});

// ─────────────────────────────────────────────────────────────
// Export router
// ─────────────────────────────────────────────────────────────
module.exports = router;
