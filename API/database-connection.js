const mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit:10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'elearning',
    multipleStatements: true
});

module.exports = pool;