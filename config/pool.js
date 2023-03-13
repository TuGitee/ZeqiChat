const mysql2 = require('mysql2/promise');
const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'chatdb',
    connectionLimit: 10,
    waitForConnections: true
})

pool.query('CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT,email VARCHAR(255) NOT NULL UNIQUE,username VARCHAR(255) NOT NULL UNIQUE,password VARCHAR(255) NOT NULL,avatar VARCHAR(255) DEFAULT "/images/default_avatar.png",create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,online BOOLEAN NOT NULL DEFAULT FALSE,PRIMARY KEY (id))')

pool.query('CREATE TABLE IF NOT EXISTS world (world_msg_id INT NOT NULL AUTO_INCREMENT,message VARCHAR(1023) NOT NULL,from_id INT NOT NULL,create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,read_list VARCHAR(255) NOT NULL DEFAULT "",PRIMARY KEY (world_msg_id))')

pool.query('CREATE TABLE IF NOT EXISTS private (private_msg_id INT NOT NULL AUTO_INCREMENT,message VARCHAR(1023) NOT NULL,from_id INT NOT NULL,to_id INT NOT NULL,create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,to_read BOOLEAN NOT NULL DEFAULT FALSE,PRIMARY KEY (private_msg_id))')

module.exports = pool;