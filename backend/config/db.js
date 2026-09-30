require("dotenv").config();
const mysql = require("mysql2");

const poolConfig = {
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

if (process.env.DATABASE_URL) {
  // Allows single-string connection URLs from cloud providers
  poolConfig.uri = process.env.DATABASE_URL;
} else {
  poolConfig.host = process.env.DB_HOST || "localhost";
  poolConfig.user = process.env.DB_USER || "root";
  poolConfig.password = process.env.DB_PASSWORD || "";
  poolConfig.database = process.env.DB_NAME || "security_suite";
  poolConfig.port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
}

// Enable SSL for cloud-hosted MySQL providers (Aiven, AWS RDS, TiDB, etc.)
if (process.env.DB_SSL === "true" || process.env.DB_SSL === "1") {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = mysql.createPool(poolConfig);

// Auto-initialize tables and migrations
function initializeDatabase() {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  const createScansTable = `
    CREATE TABLE IF NOT EXISTS scans (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NULL,
      url VARCHAR(500) NOT NULL,
      risk_level VARCHAR(50) NOT NULL,
      vulnerabilities TEXT,
      score INT NOT NULL,
      \`ssl\` JSON,
      \`domain\` JSON,
      \`headers\` JSON,
      \`technologies\` JSON,
      \`recommendations\` JSON,
      status_code VARCHAR(20),
      response_time VARCHAR(50),
      scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  pool.query(createUsersTable, (err) => {
    if (err) {
      console.warn("Database initialization (users table):", err.message);
    }
  });

  pool.query(createScansTable, (err) => {
    if (err) {
      console.warn("Database initialization (scans table):", err.message);
    } else {
      // Check if user_id column exists for existing tables
      pool.query("SHOW COLUMNS FROM scans LIKE 'user_id'", (colErr, rows) => {
        if (!colErr && rows && rows.length === 0) {
          pool.query("ALTER TABLE scans ADD COLUMN user_id INT NULL, ADD INDEX idx_user_id (user_id)", (alterErr) => {
            if (alterErr) console.warn("Could not add user_id column:", alterErr.message);
            else console.log("Added user_id column to scans table successfully");
          });
        }
      });
    }
  });
}

// Test connection on startup
pool.getConnection((err, conn) => {
  if (err) {
    console.error("Database Connection Warning:", err.message);
    console.error("Please verify database credentials in Render environment variables.");
  } else {
    console.log("MySQL Connected successfully via pool");
    conn.release();
    initializeDatabase();
  }
});

module.exports = pool;