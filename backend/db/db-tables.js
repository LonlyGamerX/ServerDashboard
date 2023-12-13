const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt"); // Import the bcrypt library
dotenv.config();

async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Enable foreign key checks
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");

    // Categories table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Categories (
        id INT AUTO_INCREMENT PRIMARY KEY UNIQUE NOT NULL,
        name VARCHAR(500) UNIQUE NOT NULL,
        icon_url TEXT NOT NULL,
        weight INT NOT NULL
      );
    `);

    // Items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Items (
        id INT AUTO_INCREMENT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        category VARCHAR(500) NOT NULL,
        url TEXT NOT NULL,
        icon_url TEXT NOT NULL,
        weight INT NOT NULL,
        FOREIGN KEY (category) REFERENCES Categories(name)
      );
    `);

    // Info table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Info (
        id INT AUTO_INCREMENT PRIMARY KEY UNIQUE NOT NULL,
        title TEXT NOT NULL,
        text_info TEXT NOT NULL
      );
    `);

    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Users (
        id INT AUTO_INCREMENT PRIMARY KEY UNIQUE NOT NULL,
        username TEXT NOT NULL,
        mail TEXT NOT NULL,
        password TEXT NOT NULL
      );
    `);

    // Setting table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Settings (
        id INT AUTO_INCREMENT PRIMARY KEY UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        value VARCHAR(255) NULL
      );
    `);

    // Check if the Users table is empty
    const [users] = await connection.execute("SELECT * FROM Users");
    if (users.length === 0) {
      // If the table is empty, insert the default user
      const defaultUsername = "admin";
      const defaultPassword = "password";

      // Hash the default password using bcrypt
      const saltRounds = 10; // You can adjust this value as needed
      const bcryptHash = await bcrypt.hash(defaultPassword, saltRounds);

      await connection.execute(
        "INSERT INTO Users (username, password) VALUES (?, ?)",
        [defaultUsername, bcryptHash]
      );
    }

    return connection;
  } catch (err) {
    console.error("Error initializing the database (TдT):", err.message);
    process.exit(1);
  }
}

module.exports = initializeDatabase();