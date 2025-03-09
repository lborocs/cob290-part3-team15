require('dotenv').config();
const mysql = require("mysql2");

console.log(process.env.HOST, process.env.USER, process.env.PASSWORD, process.env.DATABASE);

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