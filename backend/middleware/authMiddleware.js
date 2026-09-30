const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header: Bearer <token>
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.query && req.query.token) {
      // Support query parameter for direct browser PDF downloads
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        message: "Access Denied: No authentication token provided",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "AI_SECURITY_SUITE_SECRET_2026"
    );

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Access Denied: Invalid or expired token",
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Access Denied: Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access Denied: Administrator privileges required",
    });
  }

  next();
};

module.exports = authMiddleware;
module.exports.authMiddleware = authMiddleware;
module.exports.requireAdmin = requireAdmin;

