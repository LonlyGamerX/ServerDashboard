const initializeDatabase = require("../db/db-tables");

exports.getAllItems = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const [items] = await connection.execute(
      "SELECT items.*, categories.name AS categoryName FROM items INNER JOIN categories ON items.categoryID = categories.ID"
    );
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const { name, categoryID, categoryName, tags, url, subweight } = req.body;
    const [result] = await connection.execute(
      "INSERT INTO items (categoryID, categoryName, name, tags, url, subweight) VALUES (?, ?, ?, ?, ?, ?)",
      [categoryID, categoryName, name, tags, url, subweight]
    );
    res.status(201).json({
      ID: result.insertId,
      categoryID,
      categoryName,
      name,
      tags,
      url,
      subweight,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.editItem = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const { id } = req.params;
    const { name, categoryID, categoryName, tags, url, subweight } = req.body;
    await connection.execute(
      "UPDATE items SET categoryID = ?, categoryName = ?, name = ?, tags = ?, url = ?, subweight = ? WHERE ID = ?",
      [categoryID, categoryName, name, tags, url, subweight, id]
    );
    res.json({ ID: id, categoryID, categoryName, name, tags, url, subweight });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const { id } = req.params;
    await connection.execute("DELETE FROM items WHERE ID = ?", id);
    res.json({ ID: id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
