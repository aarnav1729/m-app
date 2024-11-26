// backend/models/Task.js
const { sql } = require('../config/db');

const Task = {
    createTask: async (pm_plan_checkpoint_id, machine_number, planned_completion_date) => {
        try {
            const result = await sql.query`
                INSERT INTO Tasks (pm_plan_checkpoint_id, machine_number, planned_completion_date, status)
                VALUES (${pm_plan_checkpoint_id}, ${machine_number}, ${planned_completion_date}, 'pending')
                SELECT SCOPE_IDENTITY() AS id
            `;
            return result.recordset[0].id;
        } catch (err) {
            throw err;
        }
    },
    getTasksByEngineer: async (engineer_id) => {
        try {
            const result = await sql.query`
                SELECT * FROM Tasks WHERE assigned_engineer_id = ${engineer_id}
            `;
            return result.recordset;
        } catch (err) {
            throw err;
        }
    },
    getPendingTasks: async () => {
        try {
            const result = await sql.query`
                SELECT * FROM Tasks WHERE status = 'pending'
            `;
            return result.recordset;
        } catch (err) {
            throw err;
        }
    },
    updateTaskStatus: async (task_id, status) => {
        try {
            await sql.query`
                UPDATE Tasks SET status = ${status} WHERE id = ${task_id}
            `;
        } catch (err) {
            throw err;
        }
    },
    assignEngineer: async (task_id, engineer_id) => {
        try {
            await sql.query`
                UPDATE Tasks SET assigned_engineer_id = ${engineer_id} WHERE id = ${task_id}
            `;
        } catch (err) {
            throw err;
        }
    },
    // Add more functions as needed
};

module.exports = Task;