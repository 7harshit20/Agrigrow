const mysql = require('mysql2');
const config = require('config');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'agricultural_management_system',
    waitForConnections: true,
    connectionLimit: 10,
    password: config.get('database_password'),
    queueLimit: 0
});

module.exports = db;