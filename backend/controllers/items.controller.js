const initializeDatabase = require("../db/db-tables");

exports.getAllItems = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const [items] = await connection.execute(
      "SELECT items.ID, items.name, items.tags, items.url, items.subweight, categories.ID AS categoryID, categories.name AS categoryName, categories.weight AS categoryWeight FROM items INNER JOIN categories ON items.categoryID = categories.ID"
    );

    const formattedItems = items.map((item) => ({
      ID: item.ID,
      category: {
        ID: item.categoryID,
        name: item.categoryName,
        weight: item.categoryWeight,
      },
      name: item.name,
      tags: item.tags,
      url: item.url,
      subweight: item.subweight,
    }));
    console.log("Getting all items");
    res.json(formattedItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("getAllItems Error >>> " + err);
  }
};

exports.createItem = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const { name, categoryName, tags, url, subweight } = req.body;

    // Look up the category ID based on categoryName
    const [category] = await connection.execute(
      "SELECT ID FROM categories WHERE name = ?",
      [categoryName]
    );

    let categoryID;

    if (category.length === 0) {
      // If the category doesn't exist, create it and get its ID
      const [result] = await connection.execute(
        "INSERT INTO categories (name, weight) VALUES (?, ?)",
        [categoryName, 0] // You may set the weight as needed
      );
      categoryID = result.insertId;
    } else {
      categoryID = category[0].ID;
    }

    const [result] = await connection.execute(
      "INSERT INTO items (categoryID, name, tags, url, subweight) VALUES (?, ?, ?, ?, ?)",
      [categoryID, name, tags, url, subweight]
    );

    console.log("Creating item");
    res.status(201).json({
      ID: result.insertId,
      category: {
        ID: categoryID,
        name: categoryName,
      },
      name,
      tags,
      url,
      subweight,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("createItem Error >>> " + err);
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
    console.log("Editing item");
    res.json({ ID: id, categoryID, categoryName, name, tags, url, subweight });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("editItem Error >>> " + err);
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const connection = await initializeDatabase;
    const { id } = req.params;
    await connection.execute("DELETE FROM items WHERE ID = ?", [id]);
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
