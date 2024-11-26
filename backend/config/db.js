// backend/config/db.js
const sql = require("mssql");
require("dotenv").config();

const dbConfig = {
  user: process.env.MSSQL_USER.trim(),
  password: process.env.MSSQL_PASSWORD.trim(),
  server: process.env.MSSQL_SERVER.trim(),
  port: parseInt(process.env.MSSQL_PORT.trim(), 10),
  database: process.env.MSSQL_DATABASE.trim(),
  options: {
    trustServerCertificate: true,
    encrypt: false,
  },
};

const connectDB = async () => {
  try {
    await sql.connect(dbConfig);
    console.log("Connected to MSSQL");
  } catch (err) {
    console.error("Database Connection Failed! Bad Config: ", err);
  }
};

module.exports = { sql, connectDB };
