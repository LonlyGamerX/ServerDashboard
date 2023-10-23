const express = require("express");
const {
  getAllCategories,
  createCategory,
  deleteCategory,
  editCategory,
} = require("../controllers/categories.controller");
const initializeDatabase = require('../db/db-tables'); // Import initializeDatabase

const router = express.Router();

// Middleware to pass the MySQL connection to the controller
router.use(async (req, res, next) => {
  req.db = await initializeDatabase; // Get the database connection
  next();
});

router.get("/", getAllCategories);
router.post("/", createCategory);
router.put("/:id", editCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
