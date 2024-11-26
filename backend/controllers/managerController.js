// backend/controllers/managerController.js
const PMPlan = require('../models/PMPlan');
const Task = require('../models/Task');
const DeviationForm = require('../models/DeviationForm');
const { sql } = require('../config/db');

const managerController = {
    // Get all PM Plans/tasks for assignment
    getPMPlans: async (req, res) => {
        try {
            const pmPlans = await sql.query`
                SELECT Tasks.id as task_id, PMPlans.month, Companies.company_code, MachineTypes.name as machine_type, Tasks.machine_number, Tasks.planned_completion_date, Tasks.status
                FROM Tasks
                JOIN PMPlanCheckpoints ON Tasks.pm_plan_checkpoint_id = PMPlanCheckpoints.id
                JOIN PMPlans ON PMPlanCheckpoints.pm_plan_id = PMPlans.id
                JOIN Companies ON PMPlans.company_id = Companies.id
                JOIN MachineTypes ON PMPlans.machine_type_id = MachineTypes.id
            `;

            res.json({ success: true, data: pmPlans.recordset });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Get all engineers
    getEngineers: async (req, res) => {
        try {
            const engineers = await sql.query`SELECT * FROM Engineers`;
            res.json({ success: true, data: engineers.recordset });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Assign engineer to a task
    assignEngineer: async (req, res) => {
        const { task_id, engineer_id, comments } = req.body;

        try {
            await Task.assignEngineer(task_id, engineer_id);
            // Optionally, store comments if there's a comments field in Tasks table or elsewhere
            // For simplicity, skipping comments storage

            res.json({ success: true, message: 'Engineer assigned to task' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Get pending tasks (not completed by planned date)
    getPendingTasks: async (req, res) => {
        try {
            const pendingTasks = await sql.query`
                SELECT Tasks.id as task_id, PMPlans.month, Companies.company_code, MachineTypes.name as machine_type, Tasks.machine_number, Tasks.planned_completion_date, Tasks.status
                FROM Tasks
                JOIN PMPlanCheckpoints ON Tasks.pm_plan_checkpoint_id = PMPlanCheckpoints.id
                JOIN PMPlans ON PMPlanCheckpoints.pm_plan_id = PMPlans.id
                JOIN Companies ON PMPlans.company_id = Companies.id
                JOIN MachineTypes ON PMPlans.machine_type_id = MachineTypes.id
                WHERE Tasks.status = 'pending' AND Tasks.planned_completion_date < CONVERT(date, GETDATE())
            `;
            res.json({ success: true, data: pendingTasks.recordset });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Submit deviation form
    submitDeviationForm: async (req, res) => {
        const { task_id, updated_date, reason } = req.body;
        const manager_id = req.user.id; // Assuming user info is set in req.user via middleware

        try {
            // Create deviation form
            await DeviationForm.createDeviationForm(task_id, manager_id, updated_date, reason);

            res.json({ success: true, message: 'Deviation form submitted' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Get completed tasks with proof images
    getCompletedTasks: async (req, res) => {
        try {
            const completedTasks = await sql.query`
                SELECT CompletedTasks.id as completed_task_id, Tasks.id as task_id, PMPlans.month, Companies.company_code, MachineTypes.name as machine_type, Tasks.machine_number, Tasks.planned_completion_date, CompletedTasks.proof_image_url, Users.name as engineer
                FROM CompletedTasks
                JOIN Tasks ON CompletedTasks.task_id = Tasks.id
                JOIN PMPlanCheckpoints ON Tasks.pm_plan_checkpoint_id = PMPlanCheckpoints.id
                JOIN PMPlans ON PMPlanCheckpoints.pm_plan_id = PMPlans.id
                JOIN Companies ON PMPlans.company_id = Companies.id
                JOIN MachineTypes ON PMPlans.machine_type_id = MachineTypes.id
                JOIN Users ON Tasks.assigned_engineer_id = Users.id
                WHERE CompletedTasks.status = 'pending'
            `;
            res.json({ success: true, data: completedTasks.recordset });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Approve or assign back completed tasks
    approveCompletedTask: async (req, res) => {
        const { completed_task_id, action, comment } = req.body;
        const manager_id = req.user.id; // Assuming user info is set in req.user via middleware

        try {
            if (action === 'confirm') {
                await sql.query`
                    UPDATE CompletedTasks
                    SET status = 'confirmed', approved_by_manager_id = ${manager_id}
                    WHERE id = ${completed_task_id}
                `;
                // Update task status to 'approved'
                const taskIdResult = await sql.query`
                    SELECT task_id FROM CompletedTasks WHERE id = ${completed_task_id}
                `;
                const task_id = taskIdResult.recordset[0].task_id;
                await sql.query`
                    UPDATE Tasks
                    SET status = 'approved'
                    WHERE id = ${task_id}
                `;
            } else if (action === 'assign_back') {
                await sql.query`
                    UPDATE CompletedTasks
                    SET status = 'assigned_back', approved_by_manager_id = ${manager_id}
                    WHERE id = ${completed_task_id}
                `;
                // Reassign task to engineer by setting status back to 'pending'
                const taskIdResult = await sql.query`
                    SELECT task_id FROM CompletedTasks WHERE id = ${completed_task_id}
                `;
                const task_id = taskIdResult.recordset[0].task_id;
                await sql.query`
                    UPDATE Tasks
                    SET status = 'pending'
                    WHERE id = ${task_id}
                `;
                // Optionally, log the comment somewhere if needed
            } else {
                return res.status(400).json({ success: false, message: 'Invalid action' });
            }

            res.json({ success: true, message: `Task ${action}ed successfully` });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Add more functions as needed
};

module.exports = managerController;