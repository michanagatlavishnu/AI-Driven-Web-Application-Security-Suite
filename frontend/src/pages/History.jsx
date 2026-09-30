import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function History() {
  const [scans, setScans] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchHistory();
  }, [navigate]);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/api/scans/all");
      setScans(res.data || []);
    } catch (err) {
      console.error("Fetch history error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteScan = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this scan record?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/api/scans/delete/${id}`);
      fetchHistory();
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Failed to delete scan.");
    }
  };

  const filteredScans = scans.filter((scan) => {
    const matchesSearch = (scan.url || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter = filter === "All" || scan.risk_level === filter;

    return matchesSearch && matchesFilter;
  });

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
        {/* Title */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", flexWrap: "wrap", gap: "15px" }}>
          <h1 style={{ fontSize: "36px", margin: 0 }}>📜 Scan History</h1>

          <button
            onClick={() => navigate("/scanner")}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "bold",
            }}
          >
            ← Back to Scanner
          </button>
        </div>

        {/* Total Scans */}
        <h3 style={{ color: "#60a5fa", marginBottom: "20px" }}>
          📊 Total Scans Recorded: {scans.length}
        </h3>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          {/* Search Box */}
          <input
            type="text"
            placeholder="🔍 Search by Website URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "350px",
              maxWidth: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #2563eb40",
              background: "#10244d",
              color: "white",
              fontSize: "15px",
            }}
          />

          {/* Risk Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              fontSize: "15px",
              border: "1px solid #2563eb40",
              background: "#10244d",
              color: "white",
              cursor: "pointer",
              width: "180px",
            }}
          >
            <option value="All">All Risks</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
        </div>

        {loading ? (
          <h3 style={{ color: "#60a5fa" }}>Loading history...</h3>
        ) : filteredScans.length === 0 ? (
          <div style={{ background: "#10244d", padding: "30px", borderRadius: "10px", textAlign: "center" }}>
            <h3>No scan records match your criteria.</h3>
          </div>
        ) : (
          <div style={{ overflowX: "auto", marginTop: "15px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#10244d",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{ background: "#1e3a8a", color: "white" }}>
                  <th style={{ padding: "14px", textAlign: "center" }}>#</th>
                  <th style={{ padding: "14px", textAlign: "left" }}>🌐 Website</th>
                  <th style={{ padding: "14px", textAlign: "center" }}>Score</th>
                  <th style={{ padding: "14px", textAlign: "center" }}>Risk Level</th>
                  <th style={{ padding: "14px", textAlign: "center" }}>Scan Date</th>
                  <th style={{ padding: "14px", textAlign: "center" }}>Report</th>
                  <th style={{ padding: "14px", textAlign: "center" }}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredScans.map((scan, index) => (
                  <tr
                    key={scan.id || index}
                    style={{ background: index % 2 === 0 ? "#142c5f" : "#10244d" }}
                  >
                    <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #1e3a8a40" }}>
                      {index + 1}
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #1e3a8a40", fontWeight: "bold" }}>
                      {scan.url}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        borderBottom: "1px solid #1e3a8a40",
                        fontWeight: "bold",
                        color:
                          scan.score >= 80 ? "#22c55e" : scan.score >= 50 ? "#f59e0b" : "#ef4444",
                      }}
                    >
                      {scan.score}/100
                    </td>
                    <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #1e3a8a40" }}>
                      <span
                        style={{
                          background:
                            scan.risk_level === "Low"
                              ? "#22c55e25"
                              : scan.risk_level === "Medium"
                              ? "#f59e0b25"
                              : "#ef444425",
                          color:
                            scan.risk_level === "Low"
                              ? "#22c55e"
                              : scan.risk_level === "Medium"
                              ? "#f59e0b"
                              : "#ef4444",
                          padding: "4px 12px",
                          borderRadius: "15px",
                          fontWeight: "bold",
                          fontSize: "13px",
                        }}
                      >
                        {scan.risk_level}
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #1e3a8a40", color: "#94a3b8" }}>
                      {scan.scan_date ? new Date(scan.scan_date).toLocaleString() : "N/A"}
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #1e3a8a40", textAlign: "center" }}>
                      <button
                        onClick={() => navigate(`/report/${scan.id}`)}
                        style={{
                          background: "#22c55e",
                          color: "white",
                          border: "none",
                          padding: "6px 14px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "13px",
                        }}
                      >
                        👁 View
                      </button>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #1e3a8a40" }}>
                      <button
                        onClick={() => deleteScan(scan.id)}
                        style={{
                          background: "#dc2626",
                          color: "white",
                          border: "none",
                          padding: "6px 14px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "13px",
                        }}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default History;