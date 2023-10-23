// Import the MySQL driver
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

// initialize the MySQL database connection
async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost", // Use process.env here
      user: process.env.DB_USER, // Use process.env here
      password: process.env.DB_PASSWORD, // Use process.env here
      database: process.env.DB_NAME, // Use process.env here
    });

    // Enable foreign key support (if needed)
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");

    // Categories table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        weight INT NOT NULL
      );
    `);

    // Items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS items (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        categoryID INT NOT NULL REFERENCES categories(ID),
        name VARCHAR(255) NOT NULL,
        tags VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        subweight INT NOT NULL
      );
    `);

    // Info Tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS info (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        icon VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL
      );
    `);

    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    return connection;
  } catch (err) {
    console.error("Error initializing the database:", err.message);
    process.exit(1);
  }
}

module.exports = initializeDatabase();
