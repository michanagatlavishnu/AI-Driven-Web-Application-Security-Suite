import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkStyle = ({ isActive }) => ({
    color: isActive ? "#60a5fa" : "#e2e8f0",
    textDecoration: "none",
    display: "block",
    padding: "10px 14px",
    borderRadius: "6px",
    background: isActive ? "#1e3a8a40" : "transparent",
    fontWeight: isActive ? "bold" : "normal",
  });

  return (
    <div className="sidebar" style={{ background: "#0b1b3d", borderRight: "1px solid #1e3a8a30" }}>
      <h2 style={{ color: "#60a5fa", fontSize: "20px", marginBottom: "25px" }}>
        🛡 Security Suite
      </h2>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
        <li>
          <NavLink to="/dashboard" style={linkStyle}>
            📊 Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/scanner" style={linkStyle}>
            🔍 Scanner
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" style={linkStyle}>
            📄 Reports
          </NavLink>
        </li>
        <li>
          <NavLink to="/history" style={linkStyle}>
            📜 History
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" style={linkStyle}>
            👤 Profile
          </NavLink>
        </li>
        <li style={{ marginTop: "20px" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "10px",
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🚪 Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;