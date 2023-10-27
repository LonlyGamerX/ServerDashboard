const initializeDatabase = require("../db/db-tables");
const bcrypt = require("bcrypt");

exports.authenticateUser = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const { username, password } = req.body;

    // Check if the user exists in the database
    const [user] = await connection.execute(
      "SELECT ID, username, password FROM users WHERE username = ?",
      [username]
    );

    if (user.length === 0) {
      res
        .status(401)
        .json({ message: "Authentication failed. User not found." });
      return;
    }

    // Check if the provided password matches the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user[0].password);

    if (passwordMatch) {
      res
        .status(200)
        .json({ message: "Authentication successful", user: user[0] });
    } else {
      res
        .status(401)
        .json({ message: "Authentication failed. Incorrect password." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const [users] = await connection.execute("SELECT ID, username FROM users");
    console.log("Getting all users");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("getAllUsers Error >>> " + err);
  }
};

exports.createUser = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const { username, password } = req.body;

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // Adjust the cost factor as needed

    const [result] = await connection.execute(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );
    console.log("Creating user");
    res.status(201).json({ ID: result.insertId, username });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("createUser Error >>> " + err);
  }
};

exports.editUser = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const { id } = req.params;
    const { username, password } = req.body;

    // Hash the password using bcrypt if it is provided
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10); // Adjust the cost factor as needed
    }

    await connection.execute(
      "UPDATE users SET username = ?, password = ? WHERE ID = ?",
      [username, hashedPassword, id]
    );
    console.log("Editing User");
    res.json({ ID: id, username });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("editUser Error >>> " + err);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const { id } = req.params;
    await connection.execute("DELETE FROM users WHERE ID = ?", [id]);
    console.log("Deleting user");
    res.json({
      Message: "User deleted successfully!",
      ID: id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("deleteUser Error >>> " + err);
  }
};
