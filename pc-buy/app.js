const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
connectDB();
const PORT = process.env.PORT || 3000;
const open = require('open').default;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/product', (req, res) => {
  res.render('product', {
    id: req.query.id || '',
  });
});

//TEMPORARY CODE DELETE AFTER
const seedRoute = require('./routes/seed');
app.use(seedRoute);

//Start Server & Browser
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  open(`http://localhost:${PORT}`);
});









