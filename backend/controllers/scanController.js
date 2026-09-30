const db = require("../config/db");
const scanWebsite = require("../scanners/securityScanner");
const generatePDF = require("../utils/pdfGenerator");

// ==============================
// Add Scan
// ==============================
exports.addScan = async (req, res) => {
  const { url } = req.body;
  const userId = req.user?.id || null;

  if (!url || typeof url !== "string" || url.trim() === "") {
    return res.status(400).json({ message: "Valid website URL is required" });
  }

  try {
    const result = await scanWebsite(url);

    const sql = `
      INSERT INTO scans
      (
        url,
        risk_level,
        vulnerabilities,
        score,
        \`ssl\`,
        \`domain\`,
        \`headers\`,
        \`technologies\`,
        \`recommendations\`,
        status_code,
        response_time,
        user_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      result.url,
      result.riskLevel,
      result.vulnerabilities,
      result.score,
      JSON.stringify(result.ssl),
      JSON.stringify(result.domain),
      JSON.stringify(result.headers),
      JSON.stringify(result.technologies),
      JSON.stringify(result.recommendations),
      result.statusCode,
      result.responseTime,
      userId,
    ];

    db.query(sql, values, (err, queryResult) => {
      if (err) {
        console.error("MYSQL INSERT ERROR:", err.message);
        // If user_id column doesn't exist yet, retry without user_id column for compatibility
        if (err.message && err.message.includes("Unknown column 'user_id'")) {
          const fallbackSql = `
            INSERT INTO scans
            (url, risk_level, vulnerabilities, score, \`ssl\`, \`domain\`, \`headers\`, \`technologies\`, \`recommendations\`, status_code, response_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          return db.query(fallbackSql, values.slice(0, 11), (fallbackErr, fbResult) => {
            if (fallbackErr) {
              return res.status(500).json({ message: "Database error", error: fallbackErr.message });
            }
            return res.status(201).json({
              message: "Scan Completed Successfully",
              id: fbResult.insertId,
              ...result,
            });
          });
        }
        return res.status(500).json({ message: "Database error", error: err.message });
      }

      res.status(201).json({
        message: "Scan Completed Successfully",
        id: queryResult.insertId,
        ...result,
      });
    });
  } catch (error) {
    console.error("Scan Failed:", error);
    res.status(500).json({
      message: "Scan Failed",
      error: error.message,
    });
  }
};

// ==============================
// Get All Scans (User-specific)
// ==============================
exports.getScans = (req, res) => {
  const userId = req.user?.id;
  const sql = "SELECT * FROM scans WHERE user_id = ? OR user_id IS NULL ORDER BY id DESC";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      // Fallback if user_id column doesn't exist
      if (err.message && err.message.includes("Unknown column 'user_id'")) {
        return db.query("SELECT * FROM scans ORDER BY id DESC", (fbErr, fbRes) => {
          if (fbErr) return res.status(500).json(fbErr);
          return res.json(fbRes || []);
        });
      }
      return res.status(500).json(err);
    }
    res.json(result || []);
  });
};

// ==============================
// Recent Scans (User-specific)
// ==============================
exports.recentScans = (req, res) => {
  const userId = req.user?.id;
  const sql = `
    SELECT
      id,
      url,
      risk_level,
      vulnerabilities,
      score,
      scan_date
    FROM scans
    WHERE user_id = ? OR user_id IS NULL
    ORDER BY scan_date DESC
    LIMIT 5
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      if (err.message && err.message.includes("Unknown column 'user_id'")) {
        return db.query(
          "SELECT id, url, risk_level, vulnerabilities, score, scan_date FROM scans ORDER BY scan_date DESC LIMIT 5",
          (fbErr, fbRes) => {
            if (fbErr) return res.status(500).json(fbErr);
            return res.json(fbRes || []);
          }
        );
      }
      return res.status(500).json(err);
    }
    res.json(result || []);
  });
};

// ==============================
// Download PDF (Fixed & Authorized)
// ==============================
exports.downloadPDF = (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const sql = `
    SELECT *
    FROM scans
    WHERE id = ? AND (user_id = ? OR user_id IS NULL)
  `;

  db.query(sql, [id, userId], (err, result) => {
    if (err) {
      if (err.message && err.message.includes("Unknown column 'user_id'")) {
        return db.query("SELECT * FROM scans WHERE id = ?", [id], (fbErr, fbRes) => {
          if (fbErr) return res.status(500).json(fbErr);
          if (!fbRes || fbRes.length === 0) {
            return res.status(404).json({ message: "Scan Not Found" });
          }
          return generatePDF(fbRes[0], res);
        });
      }
      return res.status(500).json(err);
    }

    if (!result || result.length === 0) {
      return res.status(404).json({
        message: "Scan Not Found or Unauthorized",
      });
    }

    generatePDF(result[0], res);
  });
};

// ==============================
// Dashboard Statistics (User-specific)
// ==============================
exports.dashboardStats = (req, res) => {
  const userId = req.user?.id;

  const sql = `
    SELECT
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM scans WHERE user_id = ? OR user_id IS NULL) AS scans,
        (SELECT COUNT(*) FROM scans WHERE risk_level='Low' AND (user_id = ? OR user_id IS NULL)) AS low,
        (SELECT COUNT(*) FROM scans WHERE risk_level='Medium' AND (user_id = ? OR user_id IS NULL)) AS medium,
        (SELECT COUNT(*) FROM scans WHERE risk_level='High' AND (user_id = ? OR user_id IS NULL)) AS high,
        IFNULL((SELECT ROUND(AVG(score),1) FROM scans WHERE user_id = ? OR user_id IS NULL), 0) AS averageScore,
        IFNULL((SELECT ROUND(AVG(CAST(response_time AS UNSIGNED)),0) FROM scans WHERE user_id = ? OR user_id IS NULL), 0) AS averageResponseTime
  `;

  db.query(sql, [userId, userId, userId, userId, userId, userId], (err, result) => {
    if (err) {
      if (err.message && err.message.includes("Unknown column 'user_id'")) {
        const fbSql = `
          SELECT
              (SELECT COUNT(*) FROM users) AS users,
              (SELECT COUNT(*) FROM scans) AS scans,
              (SELECT COUNT(*) FROM scans WHERE risk_level='Low') AS low,
              (SELECT COUNT(*) FROM scans WHERE risk_level='Medium') AS medium,
              (SELECT COUNT(*) FROM scans WHERE risk_level='High') AS high,
              IFNULL((SELECT ROUND(AVG(score),1) FROM scans), 0) AS averageScore,
              IFNULL((SELECT ROUND(AVG(CAST(response_time AS UNSIGNED)),0) FROM scans), 0) AS averageResponseTime
        `;
        return db.query(fbSql, (fbErr, fbRes) => {
          if (fbErr) return res.status(500).json(fbErr);
          return res.json(fbRes[0] || {});
        });
      }
      return res.status(500).json(err);
    }

    res.json(result[0] || {});
  });
};

// ==============================
// Top Secure Websites (User-specific)
// ==============================
exports.topSecureWebsites = (req, res) => {
  const userId = req.user?.id;

  const sql = `
    SELECT
        url,
        MAX(score) AS score,
        MAX(scan_date) AS lastScan
    FROM scans
    WHERE user_id = ? OR user_id IS NULL
    GROUP BY url
    ORDER BY score DESC, lastScan DESC
    LIMIT 5
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      if (err.message && err.message.includes("Unknown column 'user_id'")) {
        const fbSql = `
          SELECT url, MAX(score) AS score, MAX(scan_date) AS lastScan
          FROM scans
          GROUP BY url
          ORDER BY score DESC, lastScan DESC
          LIMIT 5
        `;
        return db.query(fbSql, (fbErr, fbRes) => {
          if (fbErr) return res.status(500).json(fbErr);
          return res.json(fbRes || []);
        });
      }
      return res.status(500).json(err);
    }

    res.json(result || []);
  });
};

// ==============================
// Get Single Scan (User-specific)
// ==============================
exports.getScanById = (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const sql = "SELECT * FROM scans WHERE id = ? AND (user_id = ? OR user_id IS NULL)";

  db.query(sql, [id, userId], (err, result) => {
    if (err) {
      if (err.message && err.message.includes("Unknown column 'user_id'")) {
        return db.query("SELECT * FROM scans WHERE id = ?", [id], (fbErr, fbRes) => {
          if (fbErr) return res.status(500).json(fbErr);
          if (!fbRes || fbRes.length === 0) return res.status(404).json({ message: "Scan Not Found" });
          return res.json(fbRes[0]);
        });
      }
      return res.status(500).json(err);
    }

    if (!result || result.length === 0) {
      return res.status(404).json({
        message: "Scan Not Found or Unauthorized",
      });
    }

    res.json(result[0]);
  });
};

// ==============================
// Delete Scan (User-specific)
// ==============================
exports.deleteScan = (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const sql = "DELETE FROM scans WHERE id = ? AND (user_id = ? OR user_id IS NULL)";

  db.query(sql, [id, userId], (err, result) => {
    if (err) {
      if (err.message && err.message.includes("Unknown column 'user_id'")) {
        return db.query("DELETE FROM scans WHERE id = ?", [id], (fbErr) => {
          if (fbErr) return res.status(500).json(fbErr);
          return res.json({ message: "Scan Deleted Successfully" });
        });
      }
      return res.status(500).json(err);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Scan Not Found or Unauthorized to Delete",
      });
    }

    res.json({
      message: "Scan Deleted Successfully",
    });
  });
};
