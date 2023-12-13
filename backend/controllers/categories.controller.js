const initializeDatabase = require("../db/db-tables");

exports.getAllCategories = async (req, res) => {
  try {
    const connection = await initializeDatabase();
    const [categories] = await connection.execute("SELECT * FROM Categories");
    console.log("Getting all categories");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("getAllCategories Error >>> " + err);
  }
};

exports.createCategory = async (req, res) => {
  try {
    const connection = await initializeDatabase();
    const { name, iconUrl, weight } = req.body;
    const [result] = await connection.execute(
      "INSERT INTO Categories (name, iconUrl, weight) VALUES (?, ?, ?)",
      [name, iconUrl || null, weight]
    );
    console.log("Creating category");
    res.status(201).json({ ID: result.insertId, name, iconUrl, weight });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("createCategory Error >>> " + err);
  }
};

exports.editCategory = async (req, res) => {
  try {
    const connection = await initializeDatabase();
    const { id } = req.params;
    const { name, iconUrl, weight } = req.body;

    // Handle potential undefined values
    const updatedIconUrl = iconUrl || null;

    await connection.execute(
      "UPDATE Categories SET name = ?, iconUrl = IFNULL(?, iconUrl), weight = ? WHERE id = ?",
      [name, updatedIconUrl, weight, id]
    );
    console.log("Editing category");
    res.json({ ID: id, name, iconUrl: updatedIconUrl, weight });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("editCategory Error >>> " + err);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const connection = await initializeDatabase();
    const { id } = req.params;
    await connection.execute("DELETE FROM Categories WHERE id = ?", [id]);
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
