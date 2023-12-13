const initializeDatabase = require("../db/db-tables");

exports.getAllInfo = async (req, res) => {
  try {
    const connection = await initializeDatabase();
    const [info] = await connection.execute("SELECT * FROM Info");
    console.log("Getting all info");
    res.json(info);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("getAllInfo Error >>> " + err);
  }
};

exports.createInfo = async (req, res) => {
  try {
    const connection = await initializeDatabase();
    const { title, text_info } = req.body;
    const [result] = await connection.execute(
      "INSERT INTO Info (title, text_info) VALUES (?, ?)",
      [title, text_info]
    );
    console.log("Creating info");
    res.status(201).json({ ID: result.insertId, title, text_info });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("createInfo Error >>> " + err);
  }
};

exports.editInfo = async (req, res) => {
  try {
    const connection = await initializeDatabase();
    const { id } = req.params;
    const { title, text_info } = req.body;
    await connection.execute(
      "UPDATE Info SET title = ?, text_info = ? WHERE id = ?",
      [title, text_info, id]
    );
    console.log("Editing info");
    res.json({ ID: id, title, text_info });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("editInfo Error >>> " + err);
  }
};

exports.deleteInfo = async (req, res) => {
  try {
    const connection = await initializeDatabase();
    const { id } = req.params;
    await connection.execute("DELETE FROM Info WHERE id = ?", [id]);
    console.log("Deleting info");
    res.json({
      Message: "Info deleted successfully!",
      ID: id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("deleteInfo Error >>> " + err);
  }
};
