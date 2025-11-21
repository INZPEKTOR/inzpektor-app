const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Import routes
const dashboardRoutes = require('./src/routes/dashboard');

// Use routes
app.use('/', dashboardRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use.`);
    console.log(`\n💡 Solutions:`);
    console.log(`   1. Kill the process: lsof -ti:${PORT} | xargs kill -9`);
    console.log(`   2. Use a different port: PORT=3001 npm start\n`);
    process.exit(1);
  } else {
    throw err;
  }
});

