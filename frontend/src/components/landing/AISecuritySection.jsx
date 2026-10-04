import React, { useState, useEffect } from "react";
import {
  FiCpu,
  FiTerminal,
  FiCheckCircle,
  FiArrowRight,
  FiShield,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

function AISecuritySection() {
  const [activeStep, setActiveStep] = useState(4);

  // Subtle cyclic animation through check highlights
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev >= 4 ? 0 : prev + 1));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const checks = [
    { label: "HTTPS Configuration", detail: "TLS 1.3 negotiated, weak ciphers disabled" },
    { label: "Security Headers", detail: "HSTS detected, CSP & X-Frame-Options evaluated" },
    { label: "SSL Certificate", detail: "Valid issuer, RSA 2048-bit, 82 days remaining" },
    { label: "XSS Indicators", detail: "No reflected script tags detected in target HTML" },
    { label: "SQL Injection Indicators", detail: "Parameter boundaries intact, 0 error leaks" },
  ];

  const recommendations = [
    {
      action: "Enable Content-Security-Policy",
      impact: "Restricts unauthorized script execution and prevents cross-site data exfiltration.",
      code: "Content-Security-Policy: default-src 'self'; script-src 'self';",
    },
    {
      action: "Add Strict-Transport-Security",
      impact: "Enforces encrypted HTTPS connections and mitigates SSL stripping attacks.",
      code: "Strict-Transport-Security: max-age=31536000; includeSubDomains",
    },
    {
      action: "Configure X-Frame-Options",
      impact: "Guards against clickjacking and unauthorized embedding in malicious frames.",
      code: "X-Frame-Options: SAMEORIGIN",
    },
  ];

  return (
    <section className="ai-security-section">
      <div className="section-container">
        <div className="ai-split-grid">
          {/* Left Column: AI Capabilities explanation */}
          <div className="ai-text-content">
            <span className="section-pill purple">
              <HiOutlineSparkles className="pill-icon" /> NEXT-GEN INTELLIGENCE
            </span>
            <h2 className="section-title">Security Analysis Powered by AI</h2>
            <p className="section-subtitle">
              Static vulnerability scanners drown development teams in noisy false positives.
              Our integrated AI correlation engine analyzes raw scan telemetry against modern
              exploit patterns to deliver clear risk scores and drop-in code fixes.
            </p>

            <div className="ai-feature-list">
              <div className="ai-list-item">
                <div className="item-icon-box">
                  <FiCpu />
                </div>
                <div>
                  <h4>Context-Aware Threat Modeling</h4>
                  <p>Considers surrounding web architecture and technologies before scoring severity.</p>
                </div>
              </div>

              <div className="ai-list-item">
                <div className="item-icon-box">
                  <FiShield />
                </div>
                <div>
                  <h4>Executable Remediation Snippets</h4>
                  <p>Generates exact Nginx, Apache, or Express middleware configuration snippets.</p>
                </div>
              </div>

              <div className="ai-list-item">
                <div className="item-icon-box">
                  <FiCheckCircle />
                </div>
                <div>
                  <h4>False-Positive Suppression</h4>
                  <p>Filters out non-exploitable noise so engineers focus on critical perimeter threats.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Terminal Demonstration */}
          <div className="ai-terminal-wrapper">
            <div className="ai-terminal-glow"></div>

            <div className="ai-terminal-card">
              {/* Terminal Top Window Bar */}
              <div className="terminal-topbar">
                <div className="terminal-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <div className="terminal-caption">
                  <FiTerminal className="term-icon" />
                  <span>AI SECURITY ANALYZER — v2.4</span>
                </div>
                <span className="simulation-tag">SIMULATED TELEMETRY</span>
              </div>

              {/* Terminal Target Header */}
              <div className="terminal-target-bar">
                <span className="prompt-label">TARGET:</span>
                <span className="target-string">https://example.com</span>
                <span className="analyzing-pill">
                  <span className="spinner-dot"></span> Analyzing...
                </span>
              </div>

              {/* Checks Sequence */}
              <div className="terminal-checks-container">
                <div className="checks-title">HEURISTIC TELEMETRY CHECKS:</div>
                {checks.map((check, idx) => (
                  <div
                    key={idx}
                    className={`terminal-check-item ${idx <= activeStep ? "active" : ""}`}
                  >
                    <span className="check-status-icon">✓</span>
                    <span className="check-label">{check.label}</span>
                    <span className="check-detail">— {check.detail}</span>
                  </div>
                ))}
              </div>

              {/* Risk Assessment Box */}
              <div className="ai-risk-assessment-box">
                <div className="assessment-header">
                  <span className="assessment-title">AI RISK ASSESSMENT:</span>
                  <span className="assessment-badge low">LOW RISK (Score: 92/100)</span>
                </div>
                <p className="assessment-summary">
                  Perimeter demonstrates strong baseline cryptography. Minor header hardening
                  required to achieve zero-trust posture.
                </p>
              </div>

              {/* Actionable Recommendations */}
              <div className="ai-recommendations-box">
                <div className="recs-title">RECOMMENDED ACTIONS:</div>
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="rec-item">
                    <div className="rec-action-line">
                      <FiArrowRight className="rec-arrow" />
                      <strong>{rec.action}</strong>
                    </div>
                    <code className="rec-code-snippet">{rec.code}</code>
                  </div>
                ))}
              </div>

              {/* Terminal Footer Note */}
              <div className="terminal-footer-disclaimer">
                <span>Illustration representing automated vulnerability telemetry and remediation pipeline.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AISecuritySection;
