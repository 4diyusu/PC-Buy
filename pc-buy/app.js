const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('index'); // loads views/index.ejs
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/product', (req, res) => {
  res.render('product', {
    id: req.query.id || '',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
