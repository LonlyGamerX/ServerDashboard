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

    await connection.query("SET FOREIGN_KEY_CHECKS = 1");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        weight INT NOT NULL
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS items (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        categoryID INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        tags VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        subweight INT NOT NULL,
        FOREIGN KEY (categoryID) REFERENCES categories(ID)
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS info (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        icon VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    // Check if the users table is empty
    const [users] = await connection.execute("SELECT * FROM users");
    if (users.length === 0) {
      // If the table is empty, insert the default user
      const defaultUsername = "admin";
      const defaultPassword = "password";

      // Hash the default password using bcrypt
      const saltRounds = 10; // You can adjust this value as needed
      const bcryptHash = await bcrypt.hash(defaultPassword, saltRounds);

      await connection.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)",
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
