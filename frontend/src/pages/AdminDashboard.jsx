import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function AdminDashboard() {
  const navigate = useNavigate();

  const [overview, setOverview] = useState({
    totalUsers: 0,
    totalScans: 0,
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
    averageScore: 0,
  });
  const [users, setUsers] = useState([]);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [scanSearch, setScanSearch] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'users', 'scans'

  useEffect(() => {
    const token = localStorage.getItem("token");
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("user") || "null");
    } catch (e) {
      user = null;
    }

    if (!token) {
      navigate("/login");
      return;
    }

    if (!user || user.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    fetchAdminData();
  }, [navigate]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const [overviewRes, usersRes, scansRes] = await Promise.all([
        api.get("/api/admin/overview"),
        api.get("/api/admin/users"),
        api.get("/api/admin/scans"),
      ]);

      setOverview(overviewRes.data);
      setUsers(usersRes.data || []);
      setScans(scansRes.data || []);
    } catch (err) {
      console.error("Admin data fetch error:", err);
      if (err.response && err.response.status === 403) {
        setError("Access Denied: Administrator privileges required.");
      } else {
        setError(err.response?.data?.message || "Failed to load administrator data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, email) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${email}" and all their scans?`)) {
      return;
    }

    try {
      await api.delete(`/api/admin/users/${id}`);
      setSuccessMsg(`User ${email} deleted successfully.`);
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting user.");
      setTimeout(() => setError(""), 4000);
    }
  };

  const handleDeleteScan = async (id, url) => {
    if (!window.confirm(`Are you sure you want to delete scan record for "${url}"?`)) {
      return;
    }

    try {
      await api.delete(`/api/admin/scans/${id}`);
      setSuccessMsg(`Scan #${id} deleted successfully.`);
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting scan.");
      setTimeout(() => setError(""), 4000);
    }
  };

  const pieData = [
    { name: "Low Risk", value: overview.lowRisk || 0 },
    { name: "Medium Risk", value: overview.mediumRisk || 0 },
    { name: "High Risk", value: overview.highRisk || 0 },
  ];

  const barData = [
    { name: "Low", count: overview.lowRisk || 0 },
    { name: "Medium", count: overview.mediumRisk || 0 },
    { name: "High", count: overview.highRisk || 0 },
  ];

  const PIE_COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredScans = scans.filter(
    (s) =>
      s.url?.toLowerCase().includes(scanSearch.toLowerCase()) ||
      s.user_email?.toLowerCase().includes(scanSearch.toLowerCase()) ||
      s.risk_level?.toLowerCase().includes(scanSearch.toLowerCase())
  );

  return (
    <div
      style={{
        background: "#08142e",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "white",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Navbar />

      <main style={{ flex: 1, padding: "30px 24px", maxWidth: "1280px", margin: "0 auto", width: "100%" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "28px",
            paddingBottom: "16px",
            borderBottom: "1px solid #1e3a8a40",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#f59e0b", margin: 0 }}>
                ⚡ Admin Dashboard
              </h1>
              <span
                style={{
                  background: "#b45309",
                  color: "#fef3c7",
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Administrator Access
              </span>
            </div>
            <p style={{ color: "#94a3b8", margin: "6px 0 0 0", fontSize: "14px" }}>
              Centralized administrative visibility and management of users, scans, and system health.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            disabled={loading}
            style={{
              background: "#1e3a8a",
              color: "white",
              border: "1px solid #3b82f6",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div
            style={{
              background: "#450a0a",
              color: "#fca5a5",
              border: "1px solid #dc2626",
              padding: "14px 18px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              background: "#064e3b",
              color: "#a7f3d0",
              border: "1px solid #059669",
              padding: "14px 18px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            ✅ {successMsg}
          </div>
        )}

        {/* Overview Metric Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              background: "#0b1b3d",
              border: "1px solid #1e3a8a50",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <div style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
              👥 TOTAL REGISTERED USERS
            </div>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#60a5fa" }}>
              {overview.totalUsers}
            </div>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>System-wide user accounts</div>
          </div>

          <div
            style={{
              background: "#0b1b3d",
              border: "1px solid #1e3a8a50",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <div style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
              🔍 TOTAL SCANS PERFORMED
            </div>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#38bdf8" }}>
              {overview.totalScans}
            </div>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Across all registered users</div>
          </div>

          <div
            style={{
              background: "#0b1b3d",
              border: "1px solid #1e3a8a50",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <div style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
              ⚠️ HIGH RISK DETECTIONS
            </div>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#ef4444" }}>
              {overview.highRisk}
            </div>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Critical security vulnerabilities</div>
          </div>

          <div
            style={{
              background: "#0b1b3d",
              border: "1px solid #1e3a8a50",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <div style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
              🛡️ GLOBAL AVERAGE SCORE
            </div>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#22c55e" }}>
              {overview.averageScore} / 100
            </div>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Platform security posture</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "24px", borderBottom: "1px solid #1e3a8a40", paddingBottom: "10px" }}>
          {[
            { id: "overview", label: "📊 Security Overview & Analytics" },
            { id: "users", label: `👥 User Management (${users.length})` },
            { id: "scans", label: `📜 Global Scan Logs (${scans.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? "#1e3a8a" : "#0b1b3d",
                color: activeTab === tab.id ? "#60a5fa" : "#94a3b8",
                border: activeTab === tab.id ? "1px solid #3b82f6" : "1px solid #1e3a8a30",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: activeTab === tab.id ? "700" : "500",
                fontSize: "14px",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW CHARTS */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
            <div
              style={{
                background: "#0b1b3d",
                border: "1px solid #1e3a8a50",
                borderRadius: "12px",
                padding: "24px",
              }}
            >
              <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", color: "#60a5fa" }}>
                Risk Distribution Breakdown
              </h3>
              <div style={{ width: "100%", height: "260px" }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#0b1b3d", borderColor: "#1e3a8a" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div
              style={{
                background: "#0b1b3d",
                border: "1px solid #1e3a8a50",
                borderRadius: "12px",
                padding: "24px",
              }}
            >
              <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", color: "#60a5fa" }}>
                Threat Severity Analysis
              </h3>
              <div style={{ width: "100%", height: "260px" }}>
                <ResponsiveContainer>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a40" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "#0b1b3d", borderColor: "#1e3a8a" }} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === "users" && (
          <div
            style={{
              background: "#0b1b3d",
              border: "1px solid #1e3a8a50",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#60a5fa" }}>Platform Users</h3>
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                style={{
                  background: "#08142e",
                  border: "1px solid #1e3a8a",
                  color: "white",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  minWidth: "260px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ background: "#08142e", borderBottom: "2px solid #1e3a8a" }}>
                    <th style={{ padding: "12px", textAlign: "left", color: "#94a3b8" }}>ID</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#94a3b8" }}>Name</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#94a3b8" }}>Email</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#94a3b8" }}>Role</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#94a3b8" }}>Scans</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#94a3b8" }}>Joined</th>
                    <th style={{ padding: "12px", textAlign: "center", color: "#94a3b8" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: "24px", textAlign: "center", color: "#64748b" }}>
                        No users found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} style={{ borderBottom: "1px solid #1e3a8a30" }}>
                        <td style={{ padding: "12px" }}>#{u.id}</td>
                        <td style={{ padding: "12px", fontWeight: "600" }}>{u.name}</td>
                        <td style={{ padding: "12px", color: "#94a3b8" }}>{u.email}</td>
                        <td style={{ padding: "12px" }}>
                          <span
                            style={{
                              background: u.role === "admin" ? "#b45309" : "#1e3a8a40",
                              color: u.role === "admin" ? "#fef3c7" : "#93c5fd",
                              fontSize: "12px",
                              fontWeight: "bold",
                              padding: "3px 8px",
                              borderRadius: "4px",
                            }}
                          >
                            {u.role ? u.role.toUpperCase() : "USER"}
                          </span>
                        </td>
                        <td style={{ padding: "12px" }}>{u.scan_count || 0}</td>
                        <td style={{ padding: "12px", color: "#94a3b8", fontSize: "13px" }}>
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A"}
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          {u.role !== "admin" && (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.email)}
                              style={{
                                background: "#dc2626",
                                color: "white",
                                border: "none",
                                padding: "5px 10px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                                fontWeight: "600",
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: GLOBAL SCAN LOGS */}
        {activeTab === "scans" && (
          <div
            style={{
              background: "#0b1b3d",
              border: "1px solid #1e3a8a50",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#60a5fa" }}>Global Scan Audit Log</h3>
              <input
                type="text"
                placeholder="Search by URL, user email, or risk..."
                value={scanSearch}
                onChange={(e) => setScanSearch(e.target.value)}
                style={{
                  background: "#08142e",
                  border: "1px solid #1e3a8a",
                  color: "white",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  minWidth: "260px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ background: "#08142e", borderBottom: "2px solid #1e3a8a" }}>
                    <th style={{ padding: "12px", textAlign: "left", color: "#94a3b8" }}>Scan ID</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#94a3b8" }}>Target URL</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#94a3b8" }}>Scanned By</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#94a3b8" }}>Risk Level</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#94a3b8" }}>Score</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#94a3b8" }}>Date</th>
                    <th style={{ padding: "12px", textAlign: "center", color: "#94a3b8" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScans.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: "24px", textAlign: "center", color: "#64748b" }}>
                        No scans found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredScans.map((s) => (
                      <tr key={s.id} style={{ borderBottom: "1px solid #1e3a8a30" }}>
                        <td style={{ padding: "12px" }}>#{s.id}</td>
                        <td style={{ padding: "12px", fontWeight: "600", maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {s.url}
                        </td>
                        <td style={{ padding: "12px", color: "#94a3b8" }}>
                          {s.user_email || "System"}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span
                            style={{
                              background:
                                s.risk_level?.toLowerCase() === "high"
                                  ? "#ef444420"
                                  : s.risk_level?.toLowerCase() === "medium"
                                  ? "#f59e0b20"
                                  : "#22c55e20",
                              color:
                                s.risk_level?.toLowerCase() === "high"
                                  ? "#f87171"
                                  : s.risk_level?.toLowerCase() === "medium"
                                  ? "#fbbf24"
                                  : "#4ade80",
                              fontSize: "12px",
                              fontWeight: "bold",
                              padding: "3px 8px",
                              borderRadius: "4px",
                            }}
                          >
                            {s.risk_level?.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: "12px", fontWeight: "700" }}>{s.score} / 100</td>
                        <td style={{ padding: "12px", color: "#94a3b8", fontSize: "13px" }}>
                          {s.scan_date ? new Date(s.scan_date).toLocaleString() : "N/A"}
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <button
                            onClick={() => handleDeleteScan(s.id, s.url)}
                            style={{
                              background: "#dc2626",
                              color: "white",
                              border: "none",
                              padding: "5px 10px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "600",
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default AdminDashboard;
