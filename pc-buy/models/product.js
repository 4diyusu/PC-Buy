const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: String,
  shortDescription: String,
  price: Number,
  stock: Boolean,
  specs: String,
  image: String,
  brand: String,
  category: String
});

module.exports = mongoose.model('Product', ProductSchema);
