import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiX,
  FiCheckCircle,
  FiShield,
  FiArrowRight,
  FiFileText,
  FiInfo,
  FiLock,
  FiCpu,
  FiSearch,
  FiTrendingUp,
} from "react-icons/fi";

const FEATURE_DETAILS = {
  "ai-analysis": {
    title: "AI Security Analysis",
    category: "DEEP INTELLIGENCE",
    icon: <FiCpu />,
    color: "#a855f7",
    bgColor: "rgba(168, 85, 247, 0.12)",
    borderColor: "rgba(168, 85, 247, 0.35)",
    explanation:
      "AI-assisted security analysis evaluates scan findings, identifies potential weaknesses, prioritizes security risks, and provides actionable remediation guidance.",
    checks: [
      { name: "Security finding analysis", desc: "Correlates raw headers, certificates, and responses with modern exploit catalogs." },
      { name: "Risk prioritization", desc: "Identifies which vulnerabilities represent active exposure versus minor misconfigurations." },
      { name: "Threat interpretation", desc: "Translates complex HTTP and SSL anomalies into clear plain-English security insights." },
      { name: "Remediation recommendations", desc: "Delivers tailored code snippets and configuration syntax for immediate patching." },
      { name: "Security posture assessment", desc: "Calculates an aggregate posture score evaluating your defensive baseline." },
    ],
    whatYouGet:
      "Clear explanations of detected security issues and practical recommendations for improving the application's security posture.",
    note: null,
    action: { label: "Run AI Security Scan", target: "/scanner" },
  },

  "vuln-scanner": {
    title: "Vulnerability Scanner",
    category: "AUTOMATED ENGINE",
    icon: <FiSearch />,
    color: "#06b6d4",
    bgColor: "rgba(6, 182, 212, 0.12)",
    borderColor: "rgba(6, 182, 212, 0.35)",
    explanation:
      "Automatically analyzes a target web application for common security weaknesses and configuration issues across network and application layers.",
    checks: [
      { name: "XSS indicators", desc: "Evaluates input handling and client reflection vectors vulnerable to cross-site scripting." },
      { name: "SQL injection indicators", desc: "Inspects perimeter parameters and error disclosure vectors for database leakage." },
      { name: "HTTPS configuration", desc: "Verifies transport security encryption, protocol negotiation, and redirect enforcement." },
      { name: "Security headers", desc: "Inspects presence and directives of browser-level protection headers." },
      { name: "Domain/security checks", desc: "Gathers WHOIS registration metadata, DNS validity, and external host telemetry." },
      { name: "Risk scoring", desc: "Weighs all identified items to generate an immediate heuristic vulnerability score." },
    ],
    whatYouGet:
      "Rapid automated discovery of common security exposures and misconfigurations across your web endpoints without complex manual setup.",
    note:
      "Results are generated from the application's security scanning engine and should be treated as an assessment rather than a guarantee that a system is vulnerability-free.",
    action: { label: "Scan a Website", target: "/scanner" },
  },

  "ssl-analysis": {
    title: "SSL/TLS Analysis",
    category: "CERTIFICATE AUDIT",
    icon: <FiLock />,
    color: "#10b981",
    bgColor: "rgba(168, 85, 247, 0.12)",
    borderColor: "rgba(16, 185, 129, 0.35)",
    explanation:
      "Transport layer encryption protects sensitive communications from interception, verifies domain authenticity, and guards user sessions against man-in-the-middle attacks.",
    checks: [
      { name: "HTTPS availability", desc: "Validates that encrypted transport is properly configured and reachable over port 443." },
      { name: "TLS configuration", desc: "Audits protocol negotiation and ensures modern cipher suites (TLS 1.2/1.3) are active." },
      { name: "Certificate information", desc: "Extracts certificate authority, issuer identity, and algorithmic signature strength." },
      { name: "Secure connection validation", desc: "Verifies certificate expiration dates and alerts if certificates are nearing expiry." },
      { name: "Certificate/security observations", desc: "Flags self-signed certificates, hostname mismatches, and insecure cipher fallbacks." },
    ],
    whatYouGet:
      "Complete cryptographic audit confirming your endpoints encrypt user data in transit and adhere to modern HTTPS requirements.",
    note: null,
    action: { label: "Audit SSL Certificate", target: "/scanner" },
  },

  "headers-audit": {
    title: "Security Headers",
    category: "HARDENING CHECKS",
    icon: <FiShield />,
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.12)",
    borderColor: "rgba(59, 130, 246, 0.35)",
    explanation:
      "Security headers provide browser-level protections that help reduce common attack and data exposure risks across client sessions.",
    checks: [
      { name: "Content-Security-Policy", desc: "Restricts trusted resource origins to neutralize XSS and data exfiltration." },
      { name: "Strict-Transport-Security", desc: "Forces modern browsers to communicate only over encrypted HTTPS connections." },
      { name: "X-Frame-Options", desc: "Controls framing permissions to prevent clickjacking and deceptive UI overlays." },
      { name: "X-Content-Type-Options", desc: "Instructs browsers not to sniff MIME types, stopping malicious file execution." },
      { name: "Referrer-Policy", desc: "Protects user privacy by controlling how much referrer data is sent with requests." },
      { name: "Permissions-Policy", desc: "Restricts access to browser APIs like geolocation, camera, and microphone." },
    ],
    whatYouGet:
      "Verification of all 6 essential security headers implemented in the security scanner, with exact directives needed to achieve a secure rating.",
    note: null,
    action: { label: "Audit Security Headers", target: "/scanner" },
  },

  "risk-assessment": {
    title: "Risk Assessment",
    category: "SCORING METRIC",
    icon: <FiTrendingUp />,
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.12)",
    borderColor: "rgba(245, 158, 11, 0.35)",
    explanation:
      "The scanner converts security findings into an understandable score and risk classification so users can quickly prioritize remediation.",
    checks: [
      { name: "Security score", desc: "A normalized 0–100 heuristic index reflecting overall perimeter resilience." },
      { name: "Risk level", desc: "Clear Low, Medium, or High classification based on potential exploit impact." },
      { name: "Finding severity", desc: "Categorizes missing headers, cryptographic lapses, and injection indicators by severity." },
      { name: "Vulnerability distribution", desc: "Aggregates findings into visual posture distributions across audited assets." },
      { name: "Overall security posture", desc: "Provides an instant benchmark to measure security improvement over time." },
    ],
    whatYouGet:
      "Actionable 0–100 security index and High/Medium/Low risk classifications for executive and technical prioritization.",
    note: null,
    action: { label: "Calculate Risk Score", target: "/scanner" },
  },

  "security-reports": {
    title: "Security Reports",
    category: "EXECUTIVE EXPORT",
    icon: <FiFileText />,
    color: "#ec4899",
    bgColor: "rgba(236, 72, 153, 0.12)",
    borderColor: "rgba(236, 72, 153, 0.35)",
    explanation:
      "Generate professional PDF security reports containing scan summaries, technical findings, and remediation guidance for documentation and compliance audits.",
    checks: [
      { name: "Scan summary", desc: "Executive overview detailing target URL, timestamp, and audit duration." },
      { name: "Security score", desc: "Prominently displayed numerical score and grade representation." },
      { name: "Risk level", desc: "Color-coded risk level badge highlighting critical areas of concern." },
      { name: "Security findings", desc: "Detailed breakdown of audited headers, SSL status, and detected technologies." },
      { name: "Recommendations", desc: "Curated defensive recommendations to resolve detected vulnerabilities." },
      { name: "PDF export", desc: "Client-side PDF generation formatted cleanly for sharing and record-keeping." },
    ],
    whatYouGet:
      "Clean, shareable PDF documentation ready for compliance audits, engineering sprints, and executive review.",
    note: null,
    action: { label: "Generate Report", target: "/reports" },
  },
};

function FeatureDetailsModal({ featureId, onClose }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Lock body scroll only when modal is actively open
  useEffect(() => {
    if (!featureId || !FEATURE_DETAILS[featureId]) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow || "";
    };
  }, [featureId]);

  if (!featureId || !FEATURE_DETAILS[featureId]) {
    return null;
  }

  const data = FEATURE_DETAILS[featureId];

  const handleActionClick = () => {
    onClose();
    if (!token) {
      navigate("/login");
    } else {
      navigate(data.action.target);
    }
  };

  return (
    <div
      className="feature-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="feature-modal-title"
    >
      <div
        className="feature-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          "--modal-accent": data.color,
          "--modal-border": data.borderColor,
          "--modal-bg": data.bgColor,
        }}
      >
        {/* Modal Close Button */}
        <button
          type="button"
          className="feature-modal-close-btn"
          onClick={onClose}
          aria-label="Close details modal"
        >
          <FiX />
        </button>

        {/* Modal Header */}
        <div className="feature-modal-header">
          <div
            className="feature-modal-icon-box"
            style={{
              color: data.color,
              background: data.bgColor,
              borderColor: data.borderColor,
            }}
          >
            {data.icon}
          </div>
          <div>
            <span className="feature-modal-category" style={{ color: data.color }}>
              {data.category}
            </span>
            <h2 id="feature-modal-title" className="feature-modal-title">
              {data.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="feature-modal-body">
          {/* Explanation */}
          <p className="feature-modal-explanation">{data.explanation}</p>

          {/* Checklist */}
          <div className="feature-modal-checks-section">
            <h3 className="feature-modal-subheading">
              <FiShield className="subhead-icon" /> What Our Engine Audits
            </h3>
            <div className="feature-modal-checks-grid">
              {data.checks.map((item, idx) => (
                <div key={idx} className="feature-modal-check-card">
                  <div className="check-title-row">
                    <FiCheckCircle className="check-icon-solid" style={{ color: data.color }} />
                    <span className="check-item-name">{item.name}</span>
                  </div>
                  <p className="check-item-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What You Get Box */}
          <div className="feature-modal-whatyouget">
            <div className="whatyouget-header">
              <span className="whatyouget-pill">DELIVERABLE</span>
              <h4>What You Get</h4>
            </div>
            <p className="whatyouget-text">{data.whatYouGet}</p>
          </div>

          {/* Notice / Assessment Disclaimer if present */}
          {data.note && (
            <div className="feature-modal-note">
              <FiInfo className="note-icon" />
              <p className="note-text">{data.note}</p>
            </div>
          )}
        </div>

        {/* Modal Footer / Action */}
        <div className="feature-modal-footer">
          <button
            type="button"
            className="btn-modal-action"
            onClick={handleActionClick}
            style={{
              background: `linear-gradient(135deg, ${data.color}, #2563eb)`,
            }}
          >
            {data.action.label}
            <FiArrowRight className="action-arrow" />
          </button>
          <button type="button" className="btn-modal-dismiss" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeatureDetailsModal;
export { FEATURE_DETAILS };
