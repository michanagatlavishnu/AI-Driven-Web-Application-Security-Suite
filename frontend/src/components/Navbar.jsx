import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (e) {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? "#60a5fa" : "white",
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: "none",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "6px",
    background: isActive ? "#1e3a8a30" : "transparent",
  });

  return (
    <nav
      className="navbar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#0b1b3d",
        borderBottom: "1px solid #1e3a8a40",
        padding: "16px 32px",
        color: "white",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Link
          to={token ? "/dashboard" : "/"}
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#60a5fa",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          🛡 AI Security Suite
        </Link>
      </div>

      <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {token ? (
          <>
            <NavLink to="/dashboard" style={navLinkStyle}>
              📊 Dashboard
            </NavLink>
            <NavLink to="/scanner" style={navLinkStyle}>
              🔍 Scanner
            </NavLink>
            <NavLink to="/reports" style={navLinkStyle}>
              📄 Reports
            </NavLink>
            <NavLink to="/history" style={navLinkStyle}>
              📜 History
            </NavLink>
            <NavLink to="/profile" style={navLinkStyle}>
              👤 {user?.name ? user.name.split(" ")[0] : "Profile"}
            </NavLink>
            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                style={({ isActive }) => ({
                  ...navLinkStyle({ isActive }),
                  color: isActive ? "#fde68a" : "#f59e0b",
                  background: isActive ? "#b4530930" : "transparent",
                  fontWeight: "bold",
                  border: "1px solid #f59e0b40",
                })}
              >
                ⚡ Admin
              </NavLink>
            )}
            <button
              onClick={handleLogout}
              style={{
                marginLeft: "10px",
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" style={navLinkStyle}>
              Login
            </NavLink>
            <NavLink
              to="/register"
              style={{
                background: "#2563eb",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;