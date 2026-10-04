import React from "react";
import {
  FiShield,
  FiActivity,
  FiAlertTriangle,
  FiCheckCircle,
  FiExternalLink,
  FiClock,
} from "react-icons/fi";
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

function DashboardPreviewSection() {
  const pieData = [
    { name: "Low Risk", value: 18 },
    { name: "Medium Risk", value: 5 },
    { name: "High Risk", value: 1 },
  ];

  const PIE_COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

  const barData = [
    { severity: "Low", Count: 18 },
    { severity: "Medium", Count: 5 },
    { severity: "High", Count: 1 },
  ];

  const recentScansPreview = [
    {
      id: 104,
      url: "https://auth.internal-api.com",
      score: 95,
      risk: "LOW",
      status: "200 OK",
      time: "2 mins ago",
    },
    {
      id: 103,
      url: "https://checkout.payments-gateway.io",
      score: 88,
      risk: "LOW",
      status: "200 OK",
      time: "14 mins ago",
    },
    {
      id: 102,
      url: "https://legacy-portal.customer-care.net",
      score: 54,
      risk: "HIGH",
      status: "200 OK",
      time: "1 hour ago",
    },
    {
      id: 101,
      url: "https://docs.developer-hub.org",
      score: 78,
      risk: "MEDIUM",
      status: "200 OK",
      time: "3 hours ago",
    },
  ];

  return (
    <section className="dashboard-preview-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-pill">LIVE OPERATIONAL VIEW</span>
          <h2 className="section-title">Security Intelligence at a Glance</h2>
          <p className="section-subtitle">
            Experience complete visibility over your web perimeter with continuous threat telemetry,
            heuristic risk scores, and granular audit history.
          </p>
        </div>

        {/* Big Glass Dashboard Mockup Window */}
        <div className="preview-window-frame">
          {/* Top Window Bar */}
          <div className="preview-window-topbar">
            <div className="window-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="preview-nav-title">
              <FiShield className="preview-shield" />
              <span>AI Security Suite — Enterprise SOC Dashboard</span>
            </div>
            <div className="preview-live-indicator">
              <span className="pulsing-dot green"></span>
              <span>SYNCHRONIZED</span>
            </div>
          </div>

          <div className="preview-window-body">
            {/* 4 Stat Cards */}
            <div className="preview-stat-grid">
              <div className="preview-stat-card">
                <div className="stat-card-label">
                  <FiShield className="icon-blue" />
                  <span>SECURITY SCORE</span>
                </div>
                <div className="stat-card-value text-green">86 / 100</div>
                <div className="stat-card-sub">Weighted Heuristic Average</div>
              </div>

              <div className="preview-stat-card">
                <div className="stat-card-label">
                  <FiActivity className="icon-cyan" />
                  <span>TOTAL SCANS</span>
                </div>
                <div className="stat-card-value text-blue">24 Conducted</div>
                <div className="stat-card-sub">Across active endpoints</div>
              </div>

              <div className="preview-stat-card">
                <div className="stat-card-label">
                  <FiAlertTriangle className="icon-red" />
                  <span>HIGH RISK DETECTIONS</span>
                </div>
                <div className="stat-card-value text-red">1 Flagged</div>
                <div className="stat-card-sub">Requires header remediation</div>
              </div>

              <div className="preview-stat-card">
                <div className="stat-card-label">
                  <FiCheckCircle className="icon-green" />
                  <span>PROTECTED ASSETS</span>
                </div>
                <div className="stat-card-value text-green">23 Clean (96%)</div>
                <div className="stat-card-sub">Meeting hardening guidelines</div>
              </div>
            </div>

            {/* Visual Analytics Charts Row */}
            <div className="preview-charts-row">
              {/* Pie Chart */}
              <div className="preview-chart-box">
                <div className="chart-header">
                  <h4>Risk Distribution</h4>
                  <span className="chart-sub">Posture segmentation</span>
                </div>
                <div className="chart-container" style={{ width: "100%", height: 210 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0b1b3d",
                          borderColor: "#1e3a8a",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-legend">
                  <span className="legend-item">
                    <span className="legend-dot green"></span> Low Risk (75%)
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot yellow"></span> Med Risk (21%)
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot red"></span> High Risk (4%)
                  </span>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="preview-chart-box">
                <div className="chart-header">
                  <h4>Vulnerability Severity</h4>
                  <span className="chart-sub">Threat counts by category</span>
                </div>
                <div className="chart-container" style={{ width: "100%", height: 210 }}>
                  <ResponsiveContainer>
                    <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a30" />
                      <XAxis dataKey="severity" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0b1b3d",
                          borderColor: "#1e3a8a",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Bar dataKey="Count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-legend">
                  <span className="legend-item">
                    <span className="legend-dot blue"></span> Aggregated Detection Volume
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Scans Table */}
            <div className="preview-table-box">
              <div className="table-box-header">
                <h4>Recent Audited Targets</h4>
                <span className="table-live-tag">Updated live</span>
              </div>
              <div className="table-scroll-wrapper">
                <table className="preview-table">
                  <thead>
                    <tr>
                      <th>TARGET URL</th>
                      <th>SECURITY SCORE</th>
                      <th>RISK LEVEL</th>
                      <th>HTTP STATUS</th>
                      <th>AUDITED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentScansPreview.map((scan) => (
                      <tr key={scan.id}>
                        <td className="url-cell">
                          <FiExternalLink className="table-ext-icon" />
                          <span>{scan.url}</span>
                        </td>
                        <td className="score-cell">
                          <span className="table-score-badge">{scan.score} / 100</span>
                        </td>
                        <td>
                          <span className={`table-risk-pill ${scan.risk.toLowerCase()}`}>
                            {scan.risk}
                          </span>
                        </td>
                        <td className="status-cell">{scan.status}</td>
                        <td className="time-cell">
                          <FiClock className="table-time-icon" />
                          <span>{scan.time}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPreviewSection;
