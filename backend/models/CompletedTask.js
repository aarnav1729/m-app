// backend/models/CompletedTask.js
const { sql } = require('../config/db');

const CompletedTask = {
    createCompletedTask: async (task_id, proof_image_url) => {
        try {
            const result = await sql.query`
                INSERT INTO CompletedTasks (task_id, proof_image_url, status)
                VALUES (${task_id}, ${proof_image_url}, 'pending')
                SELECT SCOPE_IDENTITY() AS id
            `;
            return result.recordset[0].id;
        } catch (err) {
            throw err;
        }
    },
    getCompletedTasks: async () => {
        try {
            const result = await sql.query`SELECT * FROM CompletedTasks`;
            return result.recordset;
        } catch (err) {
            throw err;
        }
    },
    // Add more functions as needed
};

module.exports = CompletedTask;