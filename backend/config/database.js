require('dotenv').config({ path: './env' });
const mysql = require("mysql2");


//Database Connection
const database = mysql.createConnection({
    host: process.env.HOST, 
    user: process.env.USER, 
    password: process.env.PASSWORD, 
    database: process.env.DATABASE,
});

database.connect((err) => {
    if (err) {
        console.error("Database connection error:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

module.exports = database;