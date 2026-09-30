const db = require("../config/db");

// ==============================
// Admin Dashboard Overview Stats
// ==============================
exports.getOverview = (req, res) => {
  const statsQuery = `
    SELECT
      (SELECT COUNT(*) FROM users) AS total_users,
      (SELECT COUNT(*) FROM scans) AS total_scans,
      (SELECT COUNT(*) FROM scans WHERE LOWER(risk_level) = 'high') AS high_risk,
      (SELECT COUNT(*) FROM scans WHERE LOWER(risk_level) = 'medium') AS medium_risk,
      (SELECT COUNT(*) FROM scans WHERE LOWER(risk_level) = 'low') AS low_risk,
      (SELECT COALESCE(ROUND(AVG(score), 1), 0) FROM scans) AS average_score
  `;

  db.query(statsQuery, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching admin stats", error: err.message });
    }

    const row = results && results[0] ? results[0] : {};
    res.json({
      totalUsers: Number(row.total_users || 0),
      totalScans: Number(row.total_scans || 0),
      highRisk: Number(row.high_risk || 0),
      mediumRisk: Number(row.medium_risk || 0),
      lowRisk: Number(row.low_risk || 0),
      averageScore: Number(row.average_score || 0),
    });
  });
};

// ==============================
// Get All Registered Users
// ==============================
exports.getUsers = (req, res) => {
  const sql = `
    SELECT 
      u.id, 
      u.name, 
      u.email, 
      COALESCE(u.role, 'user') AS role, 
      u.created_at,
      COUNT(s.id) AS scan_count
    FROM users u
    LEFT JOIN scans s ON s.user_id = u.id
    GROUP BY u.id, u.name, u.email, u.role, u.created_at
    ORDER BY u.created_at DESC
  `;

  db.query(sql, (err, users) => {
    if (err) {
      // Fallback if role or user_id column isn't linked
      const fallbackSql = "SELECT id, name, email, 'user' AS role, created_at FROM users ORDER BY id DESC";
      return db.query(fallbackSql, (fbErr, fbUsers) => {
        if (fbErr) {
          return res.status(500).json({ message: "Error retrieving users", error: fbErr.message });
        }
        res.json(fbUsers || []);
      });
    }
    res.json(users || []);
  });
};

// ==============================
// Get Global Scan History Overview
// ==============================
exports.getAllScans = (req, res) => {
  const sql = `
    SELECT 
      s.id, 
      s.user_id,
      u.name AS user_name,
      u.email AS user_email,
      s.url, 
      s.risk_level, 
      s.score, 
      s.status_code, 
      s.response_time, 
      s.scan_date
    FROM scans s
    LEFT JOIN users u ON s.user_id = u.id
    ORDER BY s.scan_date DESC
    LIMIT 100
  `;

  db.query(sql, (err, scans) => {
    if (err) {
      // Fallback query if JOIN fails
      return db.query("SELECT * FROM scans ORDER BY id DESC LIMIT 100", (fbErr, fbScans) => {
        if (fbErr) {
          return res.status(500).json({ message: "Error retrieving scans", error: fbErr.message });
        }
        res.json(fbScans || []);
      });
    }
    res.json(scans || []);
  });
};

// ==============================
// Delete User (Admin Only)
// ==============================
exports.deleteUser = (req, res) => {
  const targetId = parseInt(req.params.id, 10);

  if (req.user && req.user.id === targetId) {
    return res.status(400).json({ message: "Administrators cannot delete their own account." });
  }

  // Delete associated scans first, then delete user
  db.query("DELETE FROM scans WHERE user_id = ?", [targetId], () => {
    db.query("DELETE FROM users WHERE id = ?", [targetId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error deleting user", error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User and associated scans deleted successfully" });
    });
  });
};

// ==============================
// Delete Scan (Admin Only)
// ==============================
exports.deleteScan = (req, res) => {
  const scanId = req.params.id;

  db.query("DELETE FROM scans WHERE id = ?", [scanId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting scan", error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Scan not found" });
    }
    res.json({ message: "Scan deleted successfully" });
  });
};
