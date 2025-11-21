const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/dashboard', dashboardController.getDashboard);
router.get('/', (req, res) => {
  res.redirect('/dashboard');
});

module.exports = router;

