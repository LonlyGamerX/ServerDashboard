const express = require("express");
const {
  getAllSettings,
  createSettings,
  editSettings,
  deleteSettings,
} = require("../controllers/settings.controller");
const initializeDatabase = require("../db/db-tables");

const router = express.Router();

// Middleware to pass the MySQL connection to the controller
router.use(async (req, res, next) => {
  req.db = await initializeDatabase;
  next();
});

router.get("/", getAllSettings);
router.post("/", createSettings);
router.put("/:id", editSettings);
router.delete("/:id", deleteSettings);

module.exports = router;
