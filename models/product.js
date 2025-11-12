const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  instock: {
  type: Number,
  default: 0,
  },
  fullSpecs: String,
  recommended: Boolean,
  image: String,
  brand: String, 
  category: String  
});

module.exports = mongoose.model('Product', productSchema);
