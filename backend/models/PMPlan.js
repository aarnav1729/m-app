// backend/models/PMPlan.js
const { sql } = require('../config/db');

const PMPlan = {
    createPMPlan: async (month, company_id, machine_type_id) => {
        try {
            const result = await sql.query`
                INSERT INTO PMPlans (month, company_id, machine_type_id, created_at)
                VALUES (${month}, ${company_id}, ${machine_type_id}, GETDATE())
                SELECT SCOPE_IDENTITY() AS id
            `;
            return result.recordset[0].id;
        } catch (err) {
            throw err;
        }
    },
    getPMPlans: async () => {
        try {
            const result = await sql.query`SELECT * FROM PMPlans`;
            return result.recordset;
        } catch (err) {
            throw err;
        }
    },
    getPMPlanById: async (id) => {
        try {
            const result = await sql.query`SELECT * FROM PMPlans WHERE id = ${id}`;
            return result.recordset[0];
        } catch (err) {
            throw err;
        }
    },
    // Add more functions as needed
};

module.exports = PMPlan;