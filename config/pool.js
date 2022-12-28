const mysql2 = require('mysql2/promise');
const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'chatdb',
    connectionLimit: 10,
    waitForConnections: true
})
module.exports = pool;