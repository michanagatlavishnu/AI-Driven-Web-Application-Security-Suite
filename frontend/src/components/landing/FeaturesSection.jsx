import React, { useState } from "react";
import {
  FiCpu,
  FiSearch,
  FiLock,
  FiShield,
  FiTrendingUp,
  FiFileText,
  FiArrowUpRight,
} from "react-icons/fi";
import FeatureDetailsModal from "./FeatureDetailsModal";

function FeaturesSection() {
  const [activeFeatureId, setActiveFeatureId] = useState(null);

  const features = [
    {
      id: "ai-analysis",
      icon: <FiCpu />,
      title: "AI Security Analysis",
      description:
        "Intelligent analysis identifies security weaknesses and provides actionable remediation guidance.",
      badge: "Deep Intelligence",
      color: "#a855f7",
      bgColor: "rgba(168, 85, 247, 0.1)",
      border: "rgba(168, 85, 247, 0.25)",
    },
    {
      id: "vuln-scanner",
      icon: <FiSearch />,
      title: "Vulnerability Scanner",
      description:
        "Detect common web application vulnerabilities and security misconfigurations.",
      badge: "Automated Engine",
      color: "#06b6d4",
      bgColor: "rgba(6, 182, 212, 0.1)",
      border: "rgba(6, 182, 212, 0.25)",
    },
    {
      id: "ssl-analysis",
      icon: <FiLock />,
      title: "SSL/TLS Analysis",
      description:
        "Evaluate HTTPS configuration, certificates, and SSL security.",
      badge: "Certificate Audit",
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
      border: "rgba(16, 185, 129, 0.25)",
    },
    {
      id: "headers-audit",
      icon: <FiShield />,
      title: "Security Headers",
      description:
        "Analyze important HTTP security headers and identify missing protections.",
      badge: "Hardening Checks",
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.1)",
      border: "rgba(59, 130, 246, 0.25)",
    },
    {
      id: "risk-assessment",
      icon: <FiTrendingUp />,
      title: "Risk Assessment",
      description:
        "Convert scan findings into a clear security score and risk level.",
      badge: "Scoring Metric",
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
      border: "rgba(245, 158, 11, 0.25)",
    },
    {
      id: "security-reports",
      icon: <FiFileText />,
      title: "Security Reports",
      description:
        "Generate professional PDF security reports for your scans.",
      badge: "Executive Export",
      color: "#ec4899",
      bgColor: "rgba(236, 72, 153, 0.1)",
      border: "rgba(236, 72, 153, 0.25)",
    },
  ];

  return (
    <section id="features" className="features-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-pill">COMPREHENSIVE CAPABILITIES</span>
          <h2 className="section-title">
            Everything You Need to Secure Your Web Applications
          </h2>
          <p className="section-subtitle">
            Unify automated vulnerability detection, protocol verification, risk scoring,
            and executive reporting into a developer-first defense platform.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="features-grid">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="feature-card-premium"
              style={{
                "--card-color": feature.color,
                "--card-border": feature.border,
                "--card-bg": feature.bgColor,
              }}
            >
              <div className="feature-card-top">
                <div
                  className="feature-icon-wrapper"
                  style={{
                    color: feature.color,
                    background: feature.bgColor,
                    borderColor: feature.border,
                  }}
                >
                  {feature.icon}
                </div>
                <span className="feature-badge" style={{ color: feature.color }}>
                  {feature.badge}
                </span>
              </div>

              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>

              <div className="feature-card-footer">
                <button
                  type="button"
                  className="feature-learn-more-btn"
                  onClick={() => setActiveFeatureId(feature.id)}
                  aria-label={`Explore checks for ${feature.title}`}
                >
                  Explore checks <FiArrowUpRight className="arrow-icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Feature Details Modal */}
      <FeatureDetailsModal
        featureId={activeFeatureId}
        onClose={() => setActiveFeatureId(null)}
      />
    </section>
  );
}

export default FeaturesSection;
