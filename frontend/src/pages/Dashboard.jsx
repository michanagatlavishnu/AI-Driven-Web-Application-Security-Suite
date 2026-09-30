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

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [topWebsites, setTopWebsites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        const [statsRes, recentRes, topRes] = await Promise.allSettled([
          api.get("/api/scans/stats"),
          api.get("/api/scans/recent"),
          api.get("/api/scans/top-secure"),
        ]);

        if (statsRes.status === "fulfilled" && statsRes.value.data) {
          setStats(statsRes.value.data);
        }
        if (recentRes.status === "fulfilled" && recentRes.value.data) {
          setRecentScans(recentRes.value.data || []);
        }
        if (topRes.status === "fulfilled" && topRes.value.data) {
          setTopWebsites(topRes.value.data || []);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const timer = setInterval(loadData, 15000);
    return () => clearInterval(timer);
  }, [navigate]);

  if (loading && !stats) {
    return (
      <div
        style={{
          background: "#08142e",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          color: "white",
        }}
      >
        <Navbar />
        <div style={{ padding: "40px", textAlign: "center", flex: 1 }}>
          <h2 style={{ color: "#60a5fa" }}>📊 Loading Security Dashboard...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  const safeStats = stats || {
    users: 0,
    scans: 0,
    low: 0,
    medium: 0,
    high: 0,
    averageScore: 0,
    averageResponseTime: 0,
  };

  const pieData = [
    { name: "Low Risk", value: safeStats.low || 0 },
    { name: "Medium Risk", value: safeStats.medium || 0 },
    { name: "High Risk", value: safeStats.high || 0 },
  ];

  const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

  const barData = [
    { name: "Low", Risk: safeStats.low || 0 },
    { name: "Medium", Risk: safeStats.medium || 0 },
    { name: "High", Risk: safeStats.high || 0 },
  ];

  return (
    <div
      style={{
        background: "#08142e",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "white",
      }}
    >
      <Navbar />

      <main style={{ flex: 1, padding: "30px 40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <h1 style={{ margin: 0 }}>📊 Security Operations Dashboard</h1>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => navigate("/scanner")}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🔍 New Scan
            </button>
            <button
              onClick={() => navigate("/reports")}
              style={{
                background: "#16a34a",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              📄 View Reports
            </button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "35px",
          }}
        >
          {[
            { title: "👤 Users Registered", value: safeStats.users, color: "#3b82f6" },
            { title: "🌐 Total Scans", value: safeStats.scans, color: "#22c55e" },
            { title: "🟢 Low Risk", value: safeStats.low, color: "#22c55e" },
            { title: "🟡 Medium Risk", value: safeStats.medium, color: "#f59e0b" },
            { title: "🔴 High Risk", value: safeStats.high, color: "#ef4444" },
            {
              title: "🛡 Avg Score",
              value: `${safeStats.averageScore}/100`,
              color: "#06b6d4",
            },
            {
              title: "⚡ Avg Response",
              value: `${safeStats.averageResponseTime} ms`,
              color: "#a855f7",
            },
          ].map((card, index) => (
            <div
              key={index}
              style={{
                background: "#10244d",
                padding: "20px",
                borderRadius: "12px",
                textAlign: "center",
                boxShadow: "0 0 10px rgba(0,0,0,.3)",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0", fontSize: "15px", color: "#94a3b8" }}>{card.title}</h3>
              <h1 style={{ color: card.color, margin: 0, fontSize: "28px" }}>{card.value}</h1>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
            gap: "25px",
            marginBottom: "35px",
          }}
        >
          <div
            style={{
              background: "#10244d",
              padding: "25px",
              borderRadius: "14px",
            }}
          >
            <h2 style={{ marginTop: 0, color: "#60a5fa" }}>📊 Risk Distribution by Severity</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a40" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ background: "#0b1b3d", borderColor: "#2563eb", color: "#fff" }}
                />
                <Bar dataKey="Risk" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              background: "#10244d",
              padding: "25px",
              borderRadius: "14px",
            }}
          >
            <h2 style={{ marginTop: 0, color: "#60a5fa" }}>🥧 Vulnerability Proportions</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#0b1b3d", borderColor: "#2563eb", color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Scans Table */}
        <div
          style={{
            background: "#10244d",
            padding: "25px",
            borderRadius: "14px",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ marginTop: 0, color: "#60a5fa" }}>🕒 Recent Scans</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
              <thead>
                <tr style={{ background: "#1e3a8a", color: "white" }}>
                  <th style={{ padding: "12px", textAlign: "left" }}>Website</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>Score</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>Risk Level</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>Scan Date</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentScans && recentScans.length > 0 ? (
                  recentScans.map((scan, index) => (
                    <tr
                      key={scan.id || index}
                      style={{ background: index % 2 === 0 ? "#142c5f" : "#10244d" }}
                    >
                      <td style={{ padding: "12px", borderBottom: "1px solid #1e3a8a40" }}>
                        {scan.url}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          padding: "12px",
                          borderBottom: "1px solid #1e3a8a40",
                          fontWeight: "bold",
                        }}
                      >
                        {scan.score}/100
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          padding: "12px",
                          borderBottom: "1px solid #1e3a8a40",
                          color:
                            scan.risk_level === "Low"
                              ? "#22c55e"
                              : scan.risk_level === "Medium"
                              ? "#f59e0b"
                              : "#ef4444",
                          fontWeight: "bold",
                        }}
                      >
                        {scan.risk_level}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          padding: "12px",
                          borderBottom: "1px solid #1e3a8a40",
                          color: "#94a3b8",
                        }}
                      >
                        {scan.scan_date ? new Date(scan.scan_date).toLocaleString() : "N/A"}
                      </td>
                      <td style={{ textAlign: "center", padding: "12px", borderBottom: "1px solid #1e3a8a40" }}>
                        <button
                          onClick={() => navigate(`/report/${scan.id}`)}
                          style={{
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "13px",
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "#94a3b8" }}>
                      No scan history found. Run a scan above to see results!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Secure Websites */}
        <div
          style={{
            background: "#10244d",
            padding: "25px",
            borderRadius: "14px",
          }}
        >
          <h2 style={{ marginTop: 0, color: "#60a5fa" }}>🏆 Top Secure Websites</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
              <thead>
                <tr style={{ background: "#1e3a8a", color: "white" }}>
                  <th style={{ padding: "12px", textAlign: "center" }}>Rank</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Website</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>Security Score</th>
                </tr>
              </thead>
              <tbody>
                {topWebsites && topWebsites.length > 0 ? (
                  topWebsites.map((site, index) => (
                    <tr
                      key={index}
                      style={{ background: index % 2 === 0 ? "#142c5f" : "#10244d" }}
                    >
                      <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #1e3a8a40" }}>
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                      </td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #1e3a8a40" }}>
                        {site.url ? site.url.replace(/^https?:\/\//, "") : "N/A"}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          borderBottom: "1px solid #1e3a8a40",
                          color: "#22c55e",
                          fontWeight: "bold",
                        }}
                      >
                        {site.score}/100
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", padding: "20px", color: "#94a3b8" }}>
                      No ranked websites yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;