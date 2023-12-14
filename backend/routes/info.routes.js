const express = require("express");
const {
  getAllInfo,
  createInfo,
  editInfo,
  deleteInfo,
} = require("../controllers/info.controller");
const initializeDatabase = require("../db/db-tables");
const { requireLogin } = require("../server");

const router = express.Router();

// Middleware to pass the MySQL connection to the controller
router.use(async (req, res, next) => {
  req.db = await initializeDatabase;
  next();
});

router.get("/", getAllInfo);
router.use(requireLogin);
router.post("/", createInfo);
router.put("/:id", editInfo);
router.delete("/:id", deleteInfo);

module.exports = router;
