import React from "react";
import { FiShield, FiClock, FiCpu, FiLock } from "react-icons/fi";

function MetricsSection() {
  const metrics = [
    {
      value: "10+",
      label: "Security Checks",
      description: "Deep inspection across headers, SSL, domain, and common injection vectors.",
      icon: <FiShield />,
      accentColor: "#3b82f6",
      glowColor: "rgba(59, 130, 246, 0.25)",
    },
    {
      value: "24/7",
      label: "Automated Monitoring",
      description: "Always-available on-demand scanning with immediate threat telemetry.",
      icon: <FiClock />,
      accentColor: "#06b6d4",
      glowColor: "rgba(6, 182, 212, 0.25)",
    },
    {
      value: "AI",
      label: "Intelligent Analysis",
      description: "Contextual vulnerability assessment with actionable remediation code.",
      icon: <FiCpu />,
      accentColor: "#a855f7",
      glowColor: "rgba(168, 85, 247, 0.25)",
    },
    {
      value: "100%",
      label: "User Data Isolation",
      description: "Strict tenant isolation ensuring your scan results are private to your account.",
      icon: <FiLock />,
      accentColor: "#10b981",
      glowColor: "rgba(16, 185, 129, 0.25)",
    },
  ];

  return (
    <section className="metrics-section">
      <div className="section-container">
        <div className="metrics-grid">
          {metrics.map((item, index) => (
            <div
              key={index}
              className="metric-card"
              style={{
                "--glow-color": item.glowColor,
                "--accent-color": item.accentColor,
              }}
            >
              <div className="metric-icon-box" style={{ color: item.accentColor }}>
                {item.icon}
              </div>
              <div className="metric-value-box">
                <span className="metric-number" style={{ color: item.accentColor }}>
                  {item.value}
                </span>
                <span className="metric-title">{item.label}</span>
              </div>
              <p className="metric-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MetricsSection;
