// backend/models/MachineType.js
const { sql } = require('../config/db');

const MachineType = {
    getAllMachineTypes: async () => {
        try {
            const result = await sql.query`SELECT * FROM MachineTypes`;
            return result.recordset;
        } catch (err) {
            throw err;
        }
    },
    getMachineTypeById: async (id) => {
        try {
            const result = await sql.query`SELECT * FROM MachineTypes WHERE id = ${id}`;
            return result.recordset[0];
        } catch (err) {
            throw err;
        }
    },
    // Add more functions as needed
};

module.exports = MachineType;