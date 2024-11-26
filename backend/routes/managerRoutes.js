// backend/routes/managerRoutes.js
const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const { authenticate } = require('../middleware/authenticate'); // Authentication middleware

// Apply authentication middleware
router.use(authenticate);

// Routes for manager role
router.get('/pm-plans', managerController.getPMPlans);
router.get('/engineers', managerController.getEngineers);
router.post('/assign', managerController.assignEngineer);
router.get('/pending-tasks', managerController.getPendingTasks);
router.post('/submit-deviation', managerController.submitDeviationForm);
router.get('/completed-tasks', managerController.getCompletedTasks);
router.post('/approve-task', managerController.approveCompletedTask);
// Add more routes as needed

module.exports = router;