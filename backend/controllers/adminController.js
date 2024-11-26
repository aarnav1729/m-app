// backend/controllers/adminController.js
const { sql } = require('../config/db');

const getSummary = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT 
                PMPlans.id as pm_plan_id,
                PMPlans.month,
                Companies.company_code,
                MachineTypes.name as machine_type,
                Tasks.id as task_id,
                Tasks.planned_completion_date,
                Tasks.status,
                Users.name as engineer,
                DeviationForms.reason,
                DeviationForms.submitted_at,
                -- Add more fields as necessary
                -- Example joins
                Users.name as deviation_submitted_by,
                Users2.name as deviation_approved_by
            FROM PMPlans
            JOIN Companies ON PMPlans.company_id = Companies.id
            JOIN MachineTypes ON PMPlans.machine_type_id = MachineTypes.id
            JOIN PMPlanCheckpoints ON PMPlans.id = PMPlanCheckpoints.pm_plan_id
            JOIN Tasks ON PMPlanCheckpoints.id = Tasks.pm_plan_checkpoint_id
            LEFT JOIN Users ON Tasks.assigned_engineer_id = Users.id
            LEFT JOIN DeviationForms ON Tasks.id = DeviationForms.task_id
            LEFT JOIN Users Users2 ON DeviationForms.approved_by_manager_id = Users2.id
        `;

        res.json({ success: true, data: result.recordset });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { getSummary };