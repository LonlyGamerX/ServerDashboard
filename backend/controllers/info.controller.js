const initializeDatabase = require("../db/db-tables");

exports.getAllInfo = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const [info] = await connection.execute("SELECT * FROM info");
    console.log("Getting all info");
    res.json(info);
  } catch {
    res.status(500).json({ message: err.message });
    console.log("getAllInfo Error >>> " + err);
  }
};

exports.createInfo = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const { icon, title, description } = req.body;
    const [result] = await connection.execute(
      "INSERT INTO info (icon, title, description) VALUES (?, ?, ?)",
      [icon, title, description]
    );
    console.log("Creating info");
    res.status(201).json({ ID: result.insertId, name, weight });
  } catch {
    res.status(500).json({ message: err.message });
    console.log("createInfo Error >>> " + err);
  }
};

exports.editInfo = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const { id } = req.params;
    const { icon, title, description } = await connection.execute(
      "UPDATE info SET icon = ?, title = ?, description = ?",
      [icon, title, description]
    );
    console.log("Editing info");
    res.json({ ID: id, name, weight });
  } catch {
    res.status(500).json({ message: err.message });
    console.log("editInfo Error >>> " + err);
  }
};

exports.deleteInfo = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const { id } = req.params;
    await connection.execute("DELETE FROM info WHERE ID = ?", [id]);
    console.log("Deleting info");
    res.json({
      Message: "Info deleted successfully!",
      ID: id,
    });
  } catch {
    res.status(500).json({ message: err.message });
    console.log("deleteInfo Error >>> " + err);
  }
};
