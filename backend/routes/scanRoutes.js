const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  addScan,
  getScans,
  getScanById,
  dashboardStats,
  topSecureWebsites,
  downloadPDF,
  recentScans,
  deleteScan,
} = require("../controllers/scanController");

// Protect all scan routes with JWT authorization
router.use(authMiddleware);

// Add Scan
router.post("/add", addScan);

// Get All Scans
router.get("/all", getScans);

// Dashboard Statistics
router.get("/stats", dashboardStats);
router.get("/top-secure", topSecureWebsites);

// Recent Scans
router.get("/recent", recentScans);

// Download PDF (Protected via Bearer header or ?token=)
router.get("/pdf/:id", downloadPDF);

// Delete Scan
router.delete("/delete/:id", deleteScan);

// Get Single Scan (KEEP THIS LAST)
router.get("/:id", getScanById);

module.exports = router;