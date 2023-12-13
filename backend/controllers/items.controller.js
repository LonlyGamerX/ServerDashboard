const initializeDatabase = require("../db/db-tables");

exports.getAllItems = async (req, res) => {
  try {
    const connection = await initializeDatabase();
    const [categories] = await connection.execute("SELECT * FROM Items");
    console.log("Getting all items");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("getAllItems Error >>> " + err);
  }
};

exports.createItem = async (req, res) => {
  try {
    const connection = await initializeDatabase();
    const { name, categoryName, url, iconUrl, weight } = req.body;

    // Look up the category ID based on categoryName
    const [category] = await connection.execute(
      "SELECT ID FROM Categories WHERE name = ?",
      [categoryName]
    );

    let categoryID;

    if (category.length === 0) {
      // If the category doesn't exist, create it and get its ID
      const [result] = await connection.execute(
        "INSERT INTO Categories (name, weight) VALUES (?, ?)",
        [categoryName, 0] // You may set the weight as needed
      );
      categoryID = result.insertId;
    } else {
      categoryID = category[0].ID;
    }

    const [result] = await connection.execute(
      "INSERT INTO Items (categoryID, name, url, iconUrl, weight) VALUES (?, ?, ?, ?, ?)",
      [categoryID, name, url, iconUrl || null, weight]
    );

    console.log("Creating item");
    res.status(201).json({
      ID: result.insertId,
      category: {
        ID: categoryID,
        name: categoryName,
      },
      name,
      url,
      iconUrl: iconUrl || null, // Handle potential undefined
      weight,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("createItem Error >>> " + err);
  }
};

exports.editItem = async (req, res) => {
  try {
    const connection = await initializeDatabase();
    const { id } = req.params;
    const { name, url, iconUrl, weight } = req.body;

    // Handle potential undefined values
    const updatedIconUrl = iconUrl || null;

    await connection.execute(
      "UPDATE Items SET name = ?, url = ?, iconUrl = ?, weight = ? WHERE ID = ?",
      [name, url, updatedIconUrl, weight, id]
    );

    console.log("Editing item");
    res.json({ ID: id, name, url, iconUrl: updatedIconUrl, weight });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("editItem Error >>> " + err);
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const connection = await initializeDatabase();
    const { id } = req.params;
    await connection.execute("DELETE FROM Items WHERE ID = ?", [id]);
    console.log("Deleting Item");
    res.json({
      Message: "Item deleted successfully!",
      ID: id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("deleteItem Error >>> " + err);
  }
};
