const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Routes
router.get("/profile", authMiddleware, getProfile);

module.exports = router;