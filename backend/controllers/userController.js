const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==============================
// Register User
// ==============================
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Please provide name, email, and password",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long",
    });
  }

  try {
    // Check if user already exists
    const checkSql = "SELECT id FROM users WHERE email = ?";
    db.query(checkSql, [email.toLowerCase().trim()], async (checkErr, existingUsers) => {
      if (checkErr) {
        return res.status(500).json({ message: "Database query error", error: checkErr.message });
      }

      if (existingUsers && existingUsers.length > 0) {
        return res.status(400).json({
          message: "An account with this email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const configuredAdmin = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.toLowerCase().trim() : null;
      const initialRole = (configuredAdmin && email.toLowerCase().trim() === configuredAdmin) ? "admin" : "user";
      const insertSql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

      db.query(
        insertSql,
        [name.trim(), email.toLowerCase().trim(), hashedPassword, initialRole],
        (err, result) => {
          if (err) {
            // Fallback for tables prior to migration
            if (err.message && err.message.includes("Unknown column 'role'")) {
              return db.query(
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                [name.trim(), email.toLowerCase().trim(), hashedPassword],
                (fbErr, fbResult) => {
                  if (fbErr) {
                    return res.status(500).json({ message: "Error registering user", error: fbErr.message });
                  }
                  return res.status(201).json({
                    message: "User Registered Successfully",
                    userId: fbResult.insertId,
                  });
                }
              );
            }
            return res.status(500).json({ message: "Error registering user", error: err.message });
          }

          res.status(201).json({
            message: "User Registered Successfully",
            userId: result.insertId,
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==============================
// Login User
// ==============================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please enter both email and password",
    });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email.toLowerCase().trim()], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    if (!result || result.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result[0];
    const configuredAdmin = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.toLowerCase().trim() : null;
    let role = user.role || "user";

    // Auto-promote designated admin account if matching configured ADMIN_EMAIL
    if (configuredAdmin && user.email.toLowerCase().trim() === configuredAdmin && role !== "admin") {
      role = "admin";
      db.query("UPDATE users SET role = 'admin' WHERE id = ?", [user.id], (updErr) => {
        if (updErr) console.warn("Failed to update admin role on login:", updErr.message);
      });
    }

    try {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role,
        },
        process.env.JWT_SECRET || "AI_SECURITY_SUITE_SECRET_2026",
        {
          expiresIn: "7d",
        }
      );

      res.json({
        message: "Login Successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role,
        },
      });
    } catch (compareErr) {
      return res.status(500).json({
        message: "Password verification error",
        error: compareErr.message,
      });
    }
  });
};

// ==============================
// Current User Profile
// ==============================
exports.getProfile = (req, res) => {
  const sql = "SELECT id, name, email, role, created_at FROM users WHERE id = ?";
  db.query(sql, [req.user.id], (err, result) => {
    if (err) {
      // Fallback if role column not yet populated
      return db.query("SELECT id, name, email, created_at FROM users WHERE id = ?", [req.user.id], (fbErr, fbRes) => {
        if (fbErr || !fbRes || fbRes.length === 0) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json({ ...fbRes[0], role: "user" });
      });
    }
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result[0]);
  });
};

// ==============================
// Change Password (Authenticated User)
// ==============================
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "Please provide current password, new password, and confirmation",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "New password and confirmation do not match",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      message: "New password must be at least 6 characters long",
    });
  }

  // Retrieve current hashed password for authenticated user
  const selectSql = "SELECT password FROM users WHERE id = ?";
  db.query(selectSql, [userId], async (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Database query error", error: err.message });
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "User account not found" });
    }

    const currentHash = rows[0].password;

    try {
      const isMatch = await bcrypt.compare(currentPassword, currentHash);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const isSamePassword = await bcrypt.compare(newPassword, currentHash);
      if (isSamePassword) {
        return res.status(400).json({
          message: "New password must be different from current password",
        });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      const updateSql = "UPDATE users SET password = ? WHERE id = ?";

      db.query(updateSql, [hashedNewPassword, userId], (updateErr) => {
        if (updateErr) {
          return res.status(500).json({
            message: "Failed to update password",
            error: updateErr.message,
          });
        }

        res.json({ message: "Password updated successfully" });
      });
    } catch (bcryptErr) {
      res.status(500).json({
        message: "Error processing password update",
        error: bcryptErr.message,
      });
    }
  });
};