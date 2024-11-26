// backend/models/DeviationForm.js
const { sql } = require('../config/db');

const DeviationForm = {
    createDeviationForm: async (task_id, manager_id, updated_date, reason) => {
        try {
            const result = await sql.query`
                INSERT INTO DeviationForms (task_id, manager_id, updated_date, reason, status)
                VALUES (${task_id}, ${manager_id}, ${updated_date}, ${reason}, 'pending')
                SELECT SCOPE_IDENTITY() AS id
            `;
            return result.recordset[0].id;
        } catch (err) {
            throw err;
        }
    },
    getAllDeviationForms: async () => {
        try {
            const result = await sql.query`SELECT * FROM DeviationForms`;
            return result.recordset;
        } catch (err) {
            throw err;
        }
    },
    getDeviationFormById: async (id) => {
        try {
            const result = await sql.query`SELECT * FROM DeviationForms WHERE id = ${id}`;
            return result.recordset[0];
        } catch (err) {
            throw err;
        }
    },
    approveDeviationForm: async (id, approved_by_manager_id) => {
        try {
            await sql.query`
                UPDATE DeviationForms
                SET status = 'approved', approved_by_manager_id = ${approved_by_manager_id}
                WHERE id = ${id}
            `;
        } catch (err) {
            throw err;
        }
    },
    declineDeviationForm: async (id) => {
        try {
            await sql.query`
                UPDATE DeviationForms
                SET status = 'declined'
                WHERE id = ${id}
            `;
        } catch (err) {
            throw err;
        }
    },
    // Add more functions as needed
};

module.exports = DeviationForm;