const mysql = require('mysql2');
const config = require('config');

const db = mysql.createPool({
    host: config.get('database_host'),
    user: config.get('database_user'),
    database: config.get('database_name'),
    waitForConnections: true,
    connectionLimit: 10,
    password: config.get('database_password'),
    queueLimit: 0
});

module.exports = db;

