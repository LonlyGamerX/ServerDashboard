const bcrypt = require("bcrypt");
const initializeDatabase = require("../db/db-tables");

exports.getAllUsers = async (req, res) => {
  try {
    const connection = await initializeDatabase();
    const [users] = await connection.execute("SELECT id, username FROM Users");
    console.log("Getting all users");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("getAllUsers Error >>> " + err);
  }
};

exports.createUser = async (req, res) => {
  try {
    const connection = await initializeDatabase();
    const { username, password, email } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await connection.execute(
      "INSERT INTO Users (username, password, email) VALUES (?, ?, ?)",
      [username, hashedPassword, email || null]
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
    const connection = await initializeDatabase();
    const { id } = req.params;
    const { username, password, email } = req.body;

    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await connection.execute(
      "UPDATE Users SET username = ?, password = ?, email = ? WHERE id = ?",
      [username, hashedPassword, email || null, id]
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
    const connection = await initializeDatabase();
    const { id } = req.params;
    await connection.execute("DELETE FROM Users WHERE id = ?", [id]);

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
