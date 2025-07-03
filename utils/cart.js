function addOrUpdateCart(cart, productId) {
  const item = cart.find(i => i.productId.toString() === productId.toString());
  if (item) {
    item.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }
}
module.exports = { addOrUpdateCart };
