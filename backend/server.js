// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { connectDB } = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const maintenanceHeadRoutes = require('./routes/maintenanceHeadRoutes');
const managerRoutes = require('./routes/managerRoutes');
const engineerRoutes = require('./routes/engineerRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/maintenance-head', maintenanceHeadRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/engineer', engineerRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});