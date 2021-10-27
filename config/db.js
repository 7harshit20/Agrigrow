const mysql = require('mysql2');
const config = require('config');

// const db = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'agricultural_management_system',
//     waitForConnections: true,
//     connectionLimit: 10,
//     password: config.get('database_password'),
//     queueLimit: 0
// });

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



// {
//     "private_key": "h72@e32",
//         "database_host": "remotemysql.com",
//             "database_user": "sTH3IO9kFf",
//                 "database_name": "sTH3IO9kFf",
//                     "database_password": "M3Xkuyrx8f"
// }
