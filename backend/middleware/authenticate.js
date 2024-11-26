// backend/middleware/authenticate.js
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    // For simplicity, using query parameters for authentication
    // Replace this with proper authentication (e.g., JWT) in production

    const { username } = req.headers; // Assume username is sent in headers

    if (!username) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const user = await User.getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        req.user = user; // Attach user to request
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { authenticate };