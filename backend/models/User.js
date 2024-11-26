// backend/models/User.js
const { sql } = require('../config/db');

const User = {
    getUserByUsername: async (username) => {
        try {
            const result = await sql.query`SELECT * FROM Users WHERE username = ${username}`;
            return result.recordset[0];
        } catch (err) {
            throw err;
        }
    },
    getAllUsers: async () => {
        try {
            const result = await sql.query`SELECT * FROM Users`;
            return result.recordset;
        } catch (err) {
            throw err;
        }
    },
    // Add more user-related functions as needed
};

module.exports = User;
