import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { API_BASE_URL } from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ViewReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchReport();
  }, [id, navigate]);

  const safeParse = (val, fallback) => {
    if (!val) return fallback;
    if (typeof val === "object") return val;
    try {
      return JSON.parse(val);
    } catch (e) {
      return fallback;
    }
  };

  const fetchReport = async () => {
    try {
      const res = await api.get(`/api/scans/${id}`);
      const data = res.data;

      setScan({
        ...data,
        ssl: safeParse(data.ssl, {}),
        domain: safeParse(data.domain, {}),
        headers: safeParse(data.headers, {}),
        technologies: safeParse(data.technologies, []),
        recommendations: safeParse(data.recommendations, []),
      });
    } catch (err) {
      console.error("Fetch report error:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const token = localStorage.getItem("token");
    window.open(
      `${API_BASE_URL}/api/scans/pdf/${id}?token=${encodeURIComponent(token || "")}`,
      "_blank"
    );
  };

  if (loading) {
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
          <h2 style={{ color: "#60a5fa" }}>Loading Report...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  if (!scan) {
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
          <h2>Report Not Found</h2>
          <button
            onClick={() => navigate("/history")}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "15px",
            }}
          >
            ← Back to History
          </button>
        </div>
        <Footer />
      </div>
    );
  }

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

      <main style={{ flex: 1, padding: "30px 40px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "10px" }}>
          <button
            onClick={() => navigate(-1)}
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
            ← Back
          </button>

          <button
            onClick={downloadPDF}
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
            ⬇ Download PDF Report
          </button>
        </div>

        <div
          style={{
            background: "#10244d",
            padding: "35px",
            borderRadius: "12px",
            boxShadow: "0 0 15px rgba(0,0,0,0.5)",
          }}
        >
          <h1 style={{ margin: "0 0 10px 0" }}>📋 Security Audit: {scan.url}</h1>
          <p style={{ color: "#94a3b8", margin: 0 }}>
            Scanned on: {scan.scan_date ? new Date(scan.scan_date).toLocaleString() : "N/A"}
          </p>

          <hr style={{ borderColor: "#1e3a8a40", margin: "25px 0" }} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "25px" }}>
            <div style={{ background: "#0b1b3d", padding: "18px", borderRadius: "10px" }}>
              <p style={{ margin: "0 0 5px 0", color: "#94a3b8" }}>Security Score</p>
              <h2 style={{ margin: 0, color: scan.score >= 80 ? "#22c55e" : scan.score >= 50 ? "#f59e0b" : "#ef4444" }}>
                {scan.score}/100
              </h2>
            </div>

            <div style={{ background: "#0b1b3d", padding: "18px", borderRadius: "10px" }}>
              <p style={{ margin: "0 0 5px 0", color: "#94a3b8" }}>Risk Level</p>
              <h2 style={{ margin: 0, color: scan.risk_level === "Low" ? "#22c55e" : scan.risk_level === "Medium" ? "#f59e0b" : "#ef4444" }}>
                {scan.risk_level}
              </h2>
            </div>

            <div style={{ background: "#0b1b3d", padding: "18px", borderRadius: "10px" }}>
              <p style={{ margin: "0 0 5px 0", color: "#94a3b8" }}>Status Code</p>
              <h2 style={{ margin: 0, color: "#60a5fa" }}>{scan.status_code || "200 OK"}</h2>
            </div>

            <div style={{ background: "#0b1b3d", padding: "18px", borderRadius: "10px" }}>
              <p style={{ margin: "0 0 5px 0", color: "#94a3b8" }}>Response Time</p>
              <h2 style={{ margin: 0, color: "#a855f7" }}>{scan.response_time || "N/A"} ms</h2>
            </div>
          </div>

          <h2>🔒 SSL Certificate</h2>
          <div style={{ background: "#0b1b3d", padding: "20px", borderRadius: "10px", marginBottom: "25px" }}>
            <p><strong>Status:</strong> {scan.ssl?.status || "Unknown"}</p>
            <p><strong>Issuer:</strong> {scan.ssl?.issuer || "Unknown"}</p>
            <p><strong>Valid From:</strong> {scan.ssl?.validFrom || "-"}</p>
            <p><strong>Valid To:</strong> {scan.ssl?.validTo || "-"}</p>
            <p><strong>Days Remaining:</strong> {scan.ssl?.daysRemaining || 0}</p>
          </div>

          <h2>🌐 Domain Information</h2>
          <div style={{ background: "#0b1b3d", padding: "20px", borderRadius: "10px", marginBottom: "25px" }}>
            <p><strong>Domain:</strong> {scan.domain?.domain || "-"}</p>
            <p><strong>Registrar:</strong> {scan.domain?.registrar || "Unknown"}</p>
            <p><strong>Country:</strong> {scan.domain?.country || "Unknown"}</p>
            <p><strong>Created:</strong> {scan.domain?.created || "Unknown"}</p>
          </div>

          <h2>🖥 Technologies Detected</h2>
          <div style={{ background: "#0b1b3d", padding: "20px", borderRadius: "10px", marginBottom: "25px" }}>
            {scan.technologies && scan.technologies.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {scan.technologies.map((item, index) => (
                  <li key={index} style={{ margin: "6px 0" }}>{item}</li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, color: "#94a3b8" }}>No technologies detected</p>
            )}
          </div>

          <h2>⚠ Vulnerabilities & Missing Headers</h2>
          <div style={{ background: "#0b1b3d", padding: "20px", borderRadius: "10px", marginBottom: "25px" }}>
            <p style={{ margin: 0, lineHeight: "24px" }}>{scan.vulnerabilities || "None detected"}</p>
          </div>

          <h2>🛡 Recommendations</h2>
          <div style={{ background: "#0b1b3d", padding: "20px", borderRadius: "10px" }}>
            {scan.recommendations && scan.recommendations.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {scan.recommendations.map((item, index) => (
                  <li key={index} style={{ margin: "6px 0" }}>{item}</li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, color: "#94a3b8" }}>No specific recommendations.</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ViewReport;