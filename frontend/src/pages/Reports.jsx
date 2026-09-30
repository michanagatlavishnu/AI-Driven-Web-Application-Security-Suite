import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { API_BASE_URL } from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Reports() {
  const [scans, setScans] = useState([]);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchScans();
  }, [navigate]);

  const fetchScans = async () => {
    try {
      const res = await api.get("/api/scans/all");
      setScans(res.data || []);
    } catch (error) {
      console.error("Fetch reports error:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = (id) => {
    const token = localStorage.getItem("token");
    window.open(
      `${API_BASE_URL}/api/scans/pdf/${id}?token=${encodeURIComponent(token || "")}`,
      "_blank"
    );
  };

  // Search + Filter
  const filteredScans = scans.filter((scan) => {
    const matchesSearch = (scan.url || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesRisk =
      riskFilter === "All" ||
      scan.risk_level === riskFilter;

    return matchesSearch && matchesRisk;
  });

  // Security Grade
  const getGrade = (score) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    return "D";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#08142e",
        display: "flex",
        flexDirection: "column",
        color: "white",
      }}
    >
      <Navbar />

      <main style={{ flex: 1, padding: "30px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" }}>
          <h1 style={{ margin: 0 }}>📄 Scan Reports</h1>

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
            ← Back to Scanner
          </button>
        </div>

        {/* Search & Filter */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "25px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="🔍 Search Website..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "12px",
              width: "320px",
              maxWidth: "100%",
              borderRadius: "8px",
              border: "1px solid #2563eb40",
              background: "#10244d",
              color: "white",
            }}
          />

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #2563eb40",
              background: "#10244d",
              color: "white",
              cursor: "pointer",
            }}
          >
            <option value="All">All Risks</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
        </div>

        {/* Reports Table */}
        {loading ? (
          <h3 style={{ color: "#60a5fa" }}>Loading reports...</h3>
        ) : (
          <div style={{ overflowX: "auto" }}>
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
                  <th style={styles.th}>Website</th>
                  <th style={styles.th}>Risk Level</th>
                  <th style={styles.th}>Score</th>
                  <th style={styles.th}>Grade</th>
                  <th style={styles.th}>Vulnerabilities</th>
                  <th style={styles.th}>Scan Date</th>
                  <th style={styles.th}>Download</th>
                </tr>
              </thead>

              <tbody>
                {filteredScans.length > 0 ? (
                  filteredScans.map((scan) => (
                    <tr key={scan.id}>
                      <td style={{ ...styles.td, textAlign: "left", fontWeight: "bold" }}>
                        <span
                          onClick={() => navigate(`/report/${scan.id}`)}
                          style={{ color: "#60a5fa", cursor: "pointer", textDecoration: "underline" }}
                        >
                          {scan.url}
                        </span>
                      </td>

                      <td
                        style={{
                          ...styles.td,
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

                      <td style={styles.td}>{scan.score ?? "-"}</td>

                      <td
                        style={{
                          ...styles.td,
                          fontWeight: "bold",
                          color:
                            scan.score >= 90
                              ? "#22c55e"
                              : scan.score >= 70
                              ? "#f59e0b"
                              : "#ef4444",
                        }}
                      >
                        {scan.score != null ? getGrade(scan.score) : "-"}
                      </td>

                      <td style={{ ...styles.td, maxWidth: "300px", textAlign: "left" }}>
                        {scan.vulnerabilities || "None"}
                      </td>

                      <td style={{ ...styles.td, color: "#94a3b8" }}>
                        {scan.scan_date ? new Date(scan.scan_date).toLocaleString() : "N/A"}
                      </td>

                      <td style={styles.td}>
                        <button
                          onClick={() => downloadPDF(scan.id)}
                          style={{
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            padding: "8px 15px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          📄 PDF
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#94a3b8" }}>
                      No scan reports found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

const styles = {
  th: {
    borderBottom: "1px solid #1e3a8a60",
    padding: "14px",
    background: "#1e3a8a",
    color: "white",
    textAlign: "center",
  },
  td: {
    borderBottom: "1px solid #1e3a8a40",
    padding: "12px",
    textAlign: "center",
  },
};

export default Reports;