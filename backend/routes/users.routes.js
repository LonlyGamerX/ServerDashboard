// users.routes.js
const express = require("express");
const initializeDatabase = require("../db/db-tables");
const {
  getAllUsers,
  createUser,
  editUser,
  deleteUser,
} = require("../controllers/users.controller");
const requireLogin = require("../authMiddleware");

const router = express.Router();

router.use(requireLogin); // Apply the middleware to all routes in this router
router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:id", editUser);
router.delete("/:id", deleteUser);

module.exports = router;
