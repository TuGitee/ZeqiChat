// require('dotenv').config()
const mysql2 = require('mysql2/promise');
const pool = mysql2.createPool({
    // host: 'gcp.connect.psdb.cloud/zeqichat',
    // user: 'dpxq2y0z0jw1dlzj0op1',
    // ssl: {
    //     rejectUnauthorized: true
    // },
    // password: 'pscale_pw_7ceQMzZayd430xI5UOMl6pTBxwV7Fpn1eWSxzqStSN9',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123',
    database: 'chatdb',
    connectionLimit: 10,
    waitForConnections: true
})

pool.query('CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT,email VARCHAR(255) NOT NULL UNIQUE,username VARCHAR(255) NOT NULL UNIQUE,password VARCHAR(255) NOT NULL,avatar VARCHAR(255) DEFAULT "/images/default_avatar.png",create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,online BOOLEAN NOT NULL DEFAULT FALSE,admin BOOLEAN NOT NULL DEFAULT FALSE,PRIMARY KEY (id))')

pool.query('CREATE TABLE IF NOT EXISTS world (world_msg_id INT NOT NULL AUTO_INCREMENT,message VARCHAR(1023) NOT NULL,from_id INT NOT NULL,create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,read_list VARCHAR(255) NOT NULL DEFAULT "",recall BOOLEAN NOT NULL DEFAULT FALSE,PRIMARY KEY (world_msg_id))')

pool.query('CREATE TABLE IF NOT EXISTS private (private_msg_id INT NOT NULL AUTO_INCREMENT,message VARCHAR(1023) NOT NULL,from_id INT NOT NULL,to_id INT NOT NULL,create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,to_read BOOLEAN NOT NULL DEFAULT FALSE,recall BOOLEAN NOT NULL DEFAULT FALSE,PRIMARY KEY (private_msg_id))')

pool.query('CREATE TABLE IF NOT EXISTS friend (request_id INT NOT NULL AUTO_INCREMENT,from_id INT NOT NULL,to_id INT NOT NULL,create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,accept BOOLEAN NOT NULL DEFAULT FALSE,PRIMARY KEY (request_id))')

pool.query('CREATE TABLE IF NOT EXISTS blog (blog_id INT NOT NULL AUTO_INCREMENT,content VARCHAR(2047),user INT NOT NULL,images VARCHAR(2047),create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY (blog_id))')

pool.query('CREATE TABLE IF NOT EXISTS comment (comment_id INT NOT NULL AUTO_INCREMENT,msg VARCHAR(2047),user_id INT NOT NULL,images VARCHAR(255),create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,blog_id INT NOT NULL,PRIMARY KEY (comment_id))')

pool.query('CREATE TABLE IF NOT EXISTS background (id INT NOT NULL,background VARCHAR(255),PRIMARY KEY (id))')

module.exports = pool;