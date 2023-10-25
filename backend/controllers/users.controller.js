const initializeDatabase = require("../db/db-tables");

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
    const bcryptHash = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 4, // number between 4-31
    });

    const [result] = await connection.execute(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, bcryptHash]
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
      hashedPassword = await Bun.password.hash(password, {
        algorithm: "bcrypt",
        cost: 4,
      });
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
    await connection.execute("DELETE FROM users WHERE ID = ?", id);
    console.log("Deleting user");
    res.json({ ID: id });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("deleteUser Error >>> " + err);
  }
};
