// backend/controllers/maintenanceHeadController.js
const PMPlan = require('../models/PMPlan');
const MachineType = require('../models/MachineType');
const DeviationForm = require('../models/DeviationForm');
const { sql } = require('../config/db');

const maintenanceHeadController = {
    // Create a new PM Plan
    createPMPlan: async (req, res) => {
        const { month, company_id, machine_type_id, checkpoints } = req.body;

        try {
            // Create PMPlan
            const pm_plan_id = await PMPlan.createPMPlan(month, company_id, machine_type_id);

            // Insert checkpoints
            for (let i = 0; i < checkpoints.length; i++) {
                const serial_number = i + 1;
                const checkpoint = checkpoints[i];
                await sql.query`
                    INSERT INTO PMPlanCheckpoints (pm_plan_id, serial_number, checkpoints)
                    VALUES (${pm_plan_id}, ${serial_number}, ${checkpoint})
                `;
            }

            res.json({ success: true, message: 'PM Plan created', pm_plan_id });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Get all companies
    getCompanies: async (req, res) => {
        try {
            const companies = await sql.query`SELECT * FROM Companies`;
            res.json({ success: true, data: companies.recordset });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Get all machine types
    getMachineTypes: async (req, res) => {
        try {
            const machineTypes = await sql.query`SELECT * FROM MachineTypes`;
            res.json({ success: true, data: machineTypes.recordset });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Duplicate PM Plans based on machine count
    duplicatePMPlans: async (req, res) => {
        const { pm_plan_id } = req.body;

        try {
            // Get the PMPlan
            const pmPlanResult = await sql.query`
                SELECT * FROM PMPlans WHERE id = ${pm_plan_id}
            `;

            if (pmPlanResult.recordset.length === 0) {
                return res.status(404).json({ success: false, message: 'PM Plan not found' });
            }

            const pmPlan = pmPlanResult.recordset[0];

            // Get machine numbers for the machine type
            const machineTypeResult = await sql.query`
                SELECT machine_numbers FROM MachineTypes WHERE id = ${pmPlan.machine_type_id}
            `;
            if (machineTypeResult.recordset.length === 0) {
                return res.status(404).json({ success: false, message: 'Machine Type not found' });
            }

            const machineNumbers = machineTypeResult.recordset[0].machine_numbers.split(',');

            // Get checkpoints for the PMPlan
            const checkpointsResult = await sql.query`
                SELECT * FROM PMPlanCheckpoints WHERE pm_plan_id = ${pm_plan_id}
            `;
            const checkpoints = checkpointsResult.recordset;

            // Duplicate PMPlan for each machine number
            for (let i = 0; i < machineNumbers.length; i++) {
                const machine_number = machineNumbers[i].trim();

                // Create a new PMPlan for each machine_number, possibly with the same month, company, machine_type
                const new_pm_plan_id = await PMPlan.createPMPlan(pmPlan.month, pmPlan.company_id, pmPlan.machine_type_id);

                // Insert checkpoints for the new PMPlan
                for (let j = 0; j < checkpoints.length; j++) {
                    const checkpoint = checkpoints[j];
                    await sql.query`
                        INSERT INTO PMPlanCheckpoints (pm_plan_id, serial_number, checkpoints)
                        VALUES (${new_pm_plan_id}, ${checkpoint.serial_number}, ${checkpoint.checkpoints})
                    `;
                }

                // Create Tasks for each checkpoint
                const pmPlanCheckpoints = await sql.query`
                    SELECT * FROM PMPlanCheckpoints WHERE pm_plan_id = ${new_pm_plan_id}
                `;
                const newCheckpoints = pmPlanCheckpoints.recordset;

                for (let k = 0; k < newCheckpoints.length; k++) {
                    const cp = newCheckpoints[k];
                    await Task.createTask(cp.id, machine_number, null); // planned_completion_date to be assigned in DatePage
                }
            }

            res.json({ success: true, message: 'PM Plans duplicated for each machine number' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Assign planned completion dates to duplicated tasks
    assignPlannedDates: async (req, res) => {
        const { task_id, planned_completion_date } = req.body;

        try {
            await sql.query`
                UPDATE Tasks
                SET planned_completion_date = ${planned_completion_date}
                WHERE id = ${task_id}
            `;
            res.json({ success: true, message: 'Planned completion date assigned' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Get all deviation forms
    getDeviationForms: async (req, res) => {
        try {
            const deviationForms = await DeviationForm.getAllDeviationForms();
            res.json({ success: true, data: deviationForms });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Approve or decline deviation forms
    approveDeviationForm: async (req, res) => {
        const { id, action, approved_by_manager_id } = req.body;

        try {
            if (action === 'approve') {
                await DeviationForm.approveDeviationForm(id, approved_by_manager_id);
            } else if (action === 'decline') {
                await DeviationForm.declineDeviationForm(id);
            } else {
                return res.status(400).json({ success: false, message: 'Invalid action' });
            }

            res.json({ success: true, message: `Deviation form ${action}d` });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Add more functions as needed
};

module.exports = maintenanceHeadController;