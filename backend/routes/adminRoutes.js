const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/authMiddleware");

const {
  getOverview,
  getUsers,
  getAllScans,
  deleteUser,
  deleteScan,
} = require("../controllers/adminController");

// Protect all admin routes with authentication AND administrator authorization
router.use(authMiddleware);
router.use(requireAdmin);

// Admin overview statistics
router.get("/overview", getOverview);

// User management
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

// Global scan history overview
router.get("/scans", getAllScans);
router.delete("/scans/:id", deleteScan);

module.exports = router;
