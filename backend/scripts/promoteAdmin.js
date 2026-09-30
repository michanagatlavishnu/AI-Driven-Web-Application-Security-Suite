require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const pool = require("../config/db");

const email = process.argv[2];

if (!email) {
  console.error("Usage: node backend/scripts/promoteAdmin.js <user-email>");
  process.exit(1);
}

const cleanEmail = email.toLowerCase().trim();

pool.query(
  "UPDATE users SET role = 'admin' WHERE LOWER(TRIM(email)) = ?",
  [cleanEmail],
  (err, result) => {
    if (err) {
      console.error("Error promoting user to admin:", err.message);
      process.exit(1);
    }

    if (result.affectedRows === 0) {
      console.log(`No user found with email: ${cleanEmail}`);
      console.log("Please ensure the user has registered first.");
    } else {
      console.log(`Success: User ${cleanEmail} has been promoted to administrator (role='admin').`);
    }

    pool.end(() => {
      process.exit(0);
    });
  }
);
