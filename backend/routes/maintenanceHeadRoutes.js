// backend/routes/maintenanceHeadRoutes.js
const express = require('express');
const router = express.Router();
const maintenanceHeadController = require('../controllers/maintenanceHeadController');
const { authenticate } = require('../middleware/authenticate'); // Authentication middleware

// Apply authentication middleware
router.use(authenticate);

// Routes for maintenance head role
router.post('/create-pm-plan', maintenanceHeadController.createPMPlan);
router.get('/companies', maintenanceHeadController.getCompanies);
router.get('/machine-types', maintenanceHeadController.getMachineTypes);
router.post('/duplicate-pm-plans', maintenanceHeadController.duplicatePMPlans);
router.post('/assign-dates', maintenanceHeadController.assignPlannedDates);
router.get('/deviations', maintenanceHeadController.getDeviationForms);
router.post('/deviations', maintenanceHeadController.approveDeviationForm);
// Add more routes as needed

module.exports = router;