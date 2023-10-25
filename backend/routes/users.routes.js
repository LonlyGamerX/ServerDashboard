const express = require("express");
const initializeDatabase = require("../db/db-tables");
const {
  getAllUsers,
  createUser,
  editUser,
  deleteUser,
} = require("../controllers/users.controller"); // Import the missing getAllUsers function

const router = express.Router();

router.use(async (req, res, next) => {
  req.db = await initializeDatabase;
  next();
});

// Protect other user routes with authentication
router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:id", editUser);
router.delete("/:id", deleteUser);

module.exports = router;
