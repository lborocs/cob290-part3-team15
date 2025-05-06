require('dotenv').config();
const mysql = require("mysql2");

const dbHost = process.env.DB_HOST || 'localhost';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbDatabase = process.env.DB_DATABASE || 'make_it_all';

console.log(`
[STATUS] Connecting to host: ${dbHost}
[STATUS] username: ${dbUser}
[STATUS] password: ${dbPassword}
[STATUS] database name: ${dbDatabase}
`);

//Database Connection
const database = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbDatabase,
});

database.connect((err) => {
    if (err) {
        console.error("Database connection error:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

//On connection, set everyone to offline
database.query("UPDATE users SET Status='Offline' WHERE Status NOT IN ('Offline','Invisible')", (err, results) => {
    if (err) {
        console.error("Error setting initial status:", err);
    } else {
        console.log("All users set to offline");
    }
});

module.exports = database;