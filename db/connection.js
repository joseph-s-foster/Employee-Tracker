const mysql = require("mysql2");
require("dotenv").config();
// Connects node to sql database
const db = mysql.createConnection({
    host: "localhost",
    // Your MySQL username,
    user: "root",
    // Your MySQL password
    password: process.env.DB_PW,
    database: "employee_tracker",
});

db.on("error", (err) => {
    console.log("- STATS Mysql2 connection died:", err);
});

module.exports = db;