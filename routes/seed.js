const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/seed-products', async (req, res) => {
    const sampleProducts = [
        // === CPUs ===
        { title: "Intel Core i3 14th Gen", description: "Entry-level 14th Gen CPU", price: 6500, images: [], instock: true, fullSpecs: "6 cores, 8 threads, 3.8GHz" },
        { title: "Intel Core i5 14th Gen", description: "Mid-range 14th Gen CPU", price: 10500, images: [], instock: true, fullSpecs: "10 cores, 16 threads, 4.2GHz" },
        { title: "Intel Core i7 14th Gen", description: "High-performance 14th Gen CPU", price: 16500, images: [], instock: true, fullSpecs: "12 cores, 20 threads, 4.7GHz" },
        { title: "Intel Core i3 13th Gen", description: "Entry-level 13th Gen CPU", price: 5900, images: [], instock: true, fullSpecs: "6 cores, 8 threads, 3.6GHz" },
        { title: "Intel Core i5 13th Gen", description: "Mid-range 13th Gen CPU", price: 9500, images: [], instock: true, fullSpecs: "10 cores, 16 threads, 4.0GHz" },
        { title: "Intel Core i7 13th Gen", description: "High-performance 13th Gen CPU", price: 15500, images: [], instock: true, fullSpecs: "12 cores, 20 threads, 4.5GHz" },
        { title: "Ryzen 3 9th Gen", description: "Budget AMD CPU", price: 4800, images: [], instock: true, fullSpecs: "4 cores, 8 threads, 3.5GHz" },
        { title: "Ryzen 5 9th Gen", description: "Balanced AMD CPU", price: 8200, images: [], instock: true, fullSpecs: "6 cores, 12 threads, 4.1GHz" },
        { title: "Ryzen 7 9th Gen", description: "High-end AMD CPU", price: 13200, images: [], instock: true, fullSpecs: "8 cores, 16 threads, 4.4GHz" },

        // === GPUs ===
        { title: "Asus RTX 5080", description: "Top-tier ASUS GPU", price: 48990, images: [], instock: true, fullSpecs: "16GB GDDR6X, PCIe 4.0, 320-bit" },
        { title: "Asus RTX 5070", description: "High-end ASUS GPU", price: 39990, images: [], instock: true, fullSpecs: "12GB GDDR6X, PCIe 4.0, 256-bit" },
        { title: "Asus RTX 5060", description: "Mid-range ASUS GPU", price: 30990, images: [], instock: true, fullSpecs: "8GB GDDR6, PCIe 4.0, 192-bit" },
        { title: "MSI RTX 5080", description: "Top-tier MSI GPU", price: 48990, images: [], instock: true, fullSpecs: "16GB GDDR6X, PCIe 4.0, 320-bit" },
        { title: "MSI RTX 5070", description: "High-end MSI GPU", price: 39990, images: [], instock: true, fullSpecs: "12GB GDDR6X, PCIe 4.0, 256-bit" },
        { title: "MSI RTX 5060", description: "Mid-range MSI GPU", price: 30990, images: [], instock: true, fullSpecs: "8GB GDDR6, PCIe 4.0, 192-bit" },
        { title: "Gigabyte RTX 5080", description: "Top-tier Gigabyte GPU", price: 48990, images: [], instock: true, fullSpecs: "16GB GDDR6X, PCIe 4.0, 320-bit" },
        { title: "Gigabyte RTX 5070", description: "High-end Gigabyte GPU", price: 39990, images: [], instock: true, fullSpecs: "12GB GDDR6X, PCIe 4.0, 256-bit" },
        { title: "Gigabyte RTX 5060", description: "Mid-range Gigabyte GPU", price: 30990, images: [], instock: true, fullSpecs: "8GB GDDR6, PCIe 4.0, 192-bit" }
    ];

  try {
    await Product.insertMany(sampleProducts);
    res.send("✅ Seeded 18 products to MongoDB!");
  } catch (error) {
    res.status(500).send("❌ Failed to insert products: " + error.message);
  }
});

module.exports = router;
