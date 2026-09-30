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
      const insertSql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

      db.query(
        insertSql,
        [name.trim(), email.toLowerCase().trim(), hashedPassword],
        (err, result) => {
          if (err) {
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
  const sql = "SELECT id, name, email, created_at FROM users WHERE id = ?";
  db.query(sql, [req.user.id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result[0]);
  });
};