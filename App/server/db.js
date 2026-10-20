const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'speak_app',
  password: process.env.DB_PASSWORD || 'speak_app_pw',
  database: process.env.DB_NAME || 'speak',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
