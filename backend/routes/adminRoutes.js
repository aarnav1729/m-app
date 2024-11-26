// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/adminController');

// Get Summary Page Data
router.get('/summary', getSummary);

module.exports = router;