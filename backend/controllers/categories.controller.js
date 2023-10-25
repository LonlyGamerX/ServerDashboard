const initializeDatabase = require("../db/db-tables");

exports.getAllCategories = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const [categories] = await connection.execute("SELECT * FROM categories");
    console.log("Getting all categories");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("getAllCategories Error >>> " + err);
  }
};

exports.createCategory = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const { name, weight } = req.body;
    const [result] = await connection.execute(
      "INSERT INTO categories (name, weight) VALUES (?, ?)",
      [name, weight]
    );
    console.log("Creating category");
    res.status(201).json({ ID: result.insertId, name, weight });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("createCategory Error >>> " + err);
  }
};

exports.editCategory = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const { id } = req.params;
    const { name, weight } = req.body;
    await connection.execute(
      "UPDATE categories SET name = ?, weight = ? WHERE ID = ?",
      [name, weight, id]
    );
    console.log("Editing category");
    res.json({ ID: id, name, weight });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("editCategory Error >>> " + err);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const { id } = req.params;
    await connection.execute("DELETE FROM categories WHERE ID = ?", id);
    console.log("Deleting category");
    res.json({ ID: id });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("deleteCategory Error >>> " + err);
  }
};
