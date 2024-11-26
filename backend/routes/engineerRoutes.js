// backend/routes/engineerRoutes.js
const express = require('express');
const router = express.Router();
const engineerController = require('../controllers/engineerController');
const { authenticate } = require('../middleware/authenticate'); // Authentication middleware

// Apply authentication middleware
router.use(authenticate);

// Routes for engineer role
router.get('/tasks', engineerController.getTasks);
router.get('/tasks/:id', engineerController.getTaskDetails);
router.post('/tasks/complete', engineerController.completeTask);
router.post('/tasks/submit-proof', engineerController.submitProof);
// Add more routes as needed

module.exports = router;