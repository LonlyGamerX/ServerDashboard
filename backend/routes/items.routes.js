const express = require("express");
const {
  getAllItems,
  createItem,
  editItem,
  deleteItem,
} = require("../controllers/items.controller");
const initializeDatabase = require("../db/db-tables");

const router = express.Router();

// Middleware to pass the MySQL connection to the controller
router.use(async (req, res, next) => {
  req.db = await initializeDatabase;
  next();
});

router.get("/", getAllItems);
router.post("/", createItem);
router.put("/:id", editItem);
router.delete("/:id", deleteItem);

module.exports = router;
