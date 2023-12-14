const express = require("express");
const {
  getAllUsers,
  createUser,
  editUser,
  deleteUser,
} = require("../controllers/users.controller");
const initializeDatabase = require("../db/db-tables");
const { requireLogin } = require("../server");

const router = express.Router();

// Middleware to pass the MySQL connection to the controller
router.use(async (req, res, next) => {
  req.db = await initializeDatabase;
  next();
});

router.use(requireLogin);
router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:id", editUser);
router.delete("/:id", deleteUser);

module.exports = router;
