import React from "react";
import {
  FiKey,
  FiLock,
  FiUsers,
  FiDatabase,
  FiShield,
  FiGlobe,
  FiServer,
  FiRefreshCw,
  FiCheckCircle,
} from "react-icons/fi";

function TrustSection() {
  const pillars = [
    {
      title: "JWT Authentication",
      desc: "Cryptographically signed JSON Web Tokens for stateless, tamper-proof session verification.",
      icon: <FiKey />,
      color: "#3b82f6",
    },
    {
      title: "Bcrypt Password Hashing",
      desc: "Multi-round adaptive salted hashing protects credentials against rainbow table and offline brute-force attacks.",
      icon: <FiLock />,
      color: "#06b6d4",
    },
    {
      title: "Role-Based Access Control",
      desc: "Strict administrative authorization boundaries ensure administrative routes are isolated from regular user sessions.",
      icon: <FiUsers />,
      color: "#a855f7",
    },
    {
      title: "User Scan Isolation",
      desc: "Foreign-key relational boundaries guarantee scan histories and reports are strictly scoped to the authenticated owner.",
      icon: <FiDatabase />,
      color: "#10b981",
    },
    {
      title: "Secure Database Connections",
      desc: "Mandatory TLS 1.2+ encrypted database pooling prevents cleartext credential interception in cloud transit.",
      icon: <FiServer />,
      color: "#3b82f6",
    },
    {
      title: "HTTPS / TLS",
      desc: "End-to-end encrypted transport across all frontend and API endpoints with modern security header policies.",
      icon: <FiGlobe />,
      color: "#06b6d4",
    },
    {
      title: "Protected Admin APIs",
      desc: "Multi-layer middleware checks on all administrative endpoints block unauthorized privilege escalation.",
      icon: <FiShield />,
      color: "#f59e0b",
    },
    {
      title: "Secure Password Changes",
      desc: "Zero-plaintext credential updates with mandatory current password bcrypt verification.",
      icon: <FiRefreshCw />,
      color: "#10b981",
    },
  ];

  return (
    <section id="security" className="trust-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-pill green">ENTERPRISE RESILIENCE</span>
          <h2 className="section-title">Built With Security in Mind</h2>
          <p className="section-subtitle">
            Defensive engineering principles applied at every layer of the technology stack — from
            cryptographic credential management to tenant isolation.
          </p>
        </div>

        <div className="trust-grid">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="trust-card">
              <div className="trust-card-header">
                <div className="trust-icon-box" style={{ color: pillar.color, borderColor: `${pillar.color}40` }}>
                  {pillar.icon}
                </div>
                <div className="trust-badge-row">
                  <FiCheckCircle className="trust-check" />
                  <span className="trust-card-title">{pillar.title}</span>
                </div>
              </div>
              <p className="trust-card-desc">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustSection;
