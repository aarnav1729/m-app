// backend/controllers/authController.js
const { sql } = require('../config/db');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await sql.query`SELECT * FROM Users WHERE username = ${username} AND password = ${password}`;

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            res.json({ success: true, role: user.role, username: user.username });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { login };