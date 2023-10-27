const initializeDatabase = require("../db/db-tables");

exports.getAllSettings = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const [settings] = await connection.execute("SELECT * FROM settings");
    console.log("Getting all settings");
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("getAllsettings Error >>> " + err);
  }
};

exports.createSettings = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const { name, value } = req.body;
    const [result] = await connection.execute(
      "INSERT INTO settings (name, value) VALUES (?, ?)",
      [name, value]
    );
    console.log("Creating category");
    res.status(201).json({ ID: result.insertId, name, value });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("createCategory Error >>> " + err);
  }
};

exports.editSettings = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const { id } = req.params;
    const { name, value } = req.body;
    await connection.execute(
      "UPDATE settings SET name = ?, value = ? WHERE ID = ?",
      [name, value, id]
    );
    console.log("Editing category");
    res.json({ ID: id, name, value });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("editCategory Error >>> " + err);
  }
};

exports.deleteSettings = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const { id } = req.params;
    await connection.execute("DELETE FROM settings WHERE ID = ?", [id]);
    console.log("Deleting category");
    res.json({
      Message: "Category deleted successfully!",
      ID: id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("deleteCategory Error >>> " + err);
  }
};
