// seed/productSeed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/product');

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

const products = [
  {
    title: "Razer Iskur V2 X",
    description: "Ergonomic gaming chair from Razer with built-in lumbar support, widened seat and high-density foam—designed for all-day comfort.",
    price: "19990",
    instock: "8",
    category: "Accessory",
    brand: "Razer",
    image: "/images/products/razer_iskur_v2x.jpg",
    fullSpecs: "Built-in lumbar arch | High-density foam cushions | Adjustable 152° recline | 2D Armrests | Synthetic leather"
  },
  {
    title: "Razer Iskur V2",
    description: "Flagship ergonomic chair from Razer with adaptive lumbar support system and premium synthetic leather finish.",
    price: "36995",
    instock: "7",
    category: "Accessory",
    brand: "Razer",
    image: "/images/products/razer_iskur_v2.jpg",
    fullSpecs: "Adaptive 6D lumbar support | Up to 152° recline | 4D Armrests | EPU-grade synthetic leather | Steel frame"
  },
  {
    title: "Razer Enki",
    description: "All-day comfort gaming chair from Razer, designed with a wide ultrawide seat base and built-in lumbar arch for long sessions.",
    price: "21850",
    instock: "9",
    category: "Accessory",
    brand: "Razer",
    image: "/images/products/razer_enki.jpg",
    fullSpecs: "Wide seat base | Built-in lumbar arch | 21\" ultrawide seat | 110° extended shoulder arches | Recommended height 166.5-204 cm"
  },
  {
    title: "Razer Fujin",
    description: "Mesh gaming chair from Razer focused on breathability and ergonomic posture with Synchro-tilt and height-adjustable lumbar support.",
    price: "37995",
    instock: "6",
    category: "Accessory",
    brand: "Razer",
    image: "/images/products/razer_fujin.jpg",
    fullSpecs: "Ultra-durable breathable mesh backing & seat | Synchro-tilt tech with 130° recline | Height-adjustable lumbar support | 3D Armrests"
  },
  {
    title: "Razer Fujin Pro",
    description: "Premium mesh gaming chair from Razer with 4D Armrests, aluminum alloy frame, and fully adjustable features for serious ergonomic performance.",
    price: "50000",
    instock: "5",
    category: "Accessory",
    brand: "Razer",
    image: "/images/products/razer_fujin_pro.jpg",
    fullSpecs: "Mesh upholstery | Aluminum alloy frame | 4D Armrests | Max weight 136 kg | Recommended height 170-200 cm | Up to 136° recline"
  },
  {
    title: "Razer Iskur V2 X (Alt Listing)",
    description: "Alternate listing of the Razer Iskur V2 X, same ergonomic lumbar support design in a slightly different package.",
    price: "21745",
    instock: "8",
    category: "Accessory",
    brand: "Razer",
    image: "/images/products/razer_iskur_v2x_alt.jpg",
    fullSpecs: "Built-in lumbar arch | High-density foam cushions | Adjustable 152° recline | 2D Armrests | Synthetic leather"
  }
];

const seedProducts = async () => {
  try {
    await Product.insertMany(products);
    console.log('✅ All Storage products seeded successfully!');
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error seeding Storage products:', err);
  }
};

seedProducts();
