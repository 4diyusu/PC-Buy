const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  instock: Boolean,
  fullSpecs: String,
  recommended: Boolean,
  image: String

});

module.exports = mongoose.model('Product', productSchema);

