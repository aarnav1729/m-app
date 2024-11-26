// backend/controllers/engineerController.js
const Task = require('../models/Task');
const CompletedTask = require('../models/CompletedTask'); // Assuming this model exists
const { sql } = require('../config/db');

const engineerController = {
    // Get all tasks assigned to the engineer
    getTasks: async (req, res) => {
        const engineer_id = req.user.id; // Assuming user info is set in req.user via middleware

        try {
            const tasks = await sql.query`
                SELECT Tasks.id as task_id, PMPlans.month, Companies.company_code, MachineTypes.name as machine_type, Tasks.machine_number, Tasks.planned_completion_date, Tasks.status
                FROM Tasks
                JOIN PMPlanCheckpoints ON Tasks.pm_plan_checkpoint_id = PMPlanCheckpoints.id
                JOIN PMPlans ON PMPlanCheckpoints.pm_plan_id = PMPlans.id
                JOIN Companies ON PMPlans.company_id = Companies.id
                JOIN MachineTypes ON PMPlans.machine_type_id = MachineTypes.id
                WHERE Tasks.assigned_engineer_id = ${engineer_id}
            `;

            res.json({ success: true, data: tasks.recordset });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Get task details including checkpoints
    getTaskDetails: async (req, res) => {
        const task_id = req.params.id;

        try {
            const taskResult = await sql.query`
                SELECT Tasks.id as task_id, PMPlans.id as pm_plan_id, PMPlans.month, Companies.company_code, MachineTypes.name as machine_type, Tasks.machine_number, Tasks.planned_completion_date, Tasks.status
                FROM Tasks
                JOIN PMPlanCheckpoints ON Tasks.pm_plan_checkpoint_id = PMPlanCheckpoints.id
                JOIN PMPlans ON PMPlanCheckpoints.pm_plan_id = PMPlans.id
                JOIN Companies ON PMPlans.company_id = Companies.id
                JOIN MachineTypes ON PMPlans.machine_type_id = MachineTypes.id
                WHERE Tasks.id = ${task_id}
            `;

            if (taskResult.recordset.length === 0) {
                return res.status(404).json({ success: false, message: 'Task not found' });
            }

            const task = taskResult.recordset[0];

            const checkpointsResult = await sql.query`
                SELECT * FROM PMPlanCheckpoints WHERE pm_plan_id = ${task.pm_plan_id}
            `;

            res.json({ success: true, task, checkpoints: checkpointsResult.recordset });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Mark task as completed
    completeTask: async (req, res) => {
        const { task_id } = req.body;

        try {
            // Update task status to 'completed'
            await sql.query`
                UPDATE Tasks SET status = 'completed' WHERE id = ${task_id}
            `;
            res.json({ success: true, message: 'Task marked as completed' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Submit proof image for the task
    submitProof: async (req, res) => {
        const { task_id, proof_image_url } = req.body;

        try {
            await sql.query`
                INSERT INTO CompletedTasks (task_id, proof_image_url, status)
                VALUES (${task_id}, ${proof_image_url}, 'pending')
            `;
            res.json({ success: true, message: 'Proof submitted' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Add more functions as needed
};

module.exports = engineerController;