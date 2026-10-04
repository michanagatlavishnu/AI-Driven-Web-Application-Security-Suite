import React from "react";
import { Link } from "react-router-dom";
import {
  FiShield,
  FiActivity,
  FiLock,
  FiCheckCircle,
  FiAlertTriangle,
  FiArrowRight,
  FiTerminal,
  FiCheck,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

function HeroSection() {
  const token = localStorage.getItem("token");

  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Left Column: Headline and CTAs */}
        <div className="hero-content">
          {/* Trust/Status Indicator */}
          <div className="status-badge-container">
            <span className="status-badge">
              <span className="pulsing-dot green"></span>
              AI Security Engine Online
            </span>
            <span className="status-badge">
              <span className="pulsing-dot cyan"></span>
              Real-Time Vulnerability Analysis
            </span>
          </div>

          <h1 className="hero-title">
            AI-Powered <span className="gradient-text">Web Application</span> Security
          </h1>

          <h2 className="hero-subtitle">Scan. Detect. Analyze. Secure.</h2>

          <p className="hero-description">
            Automatically identify web vulnerabilities, analyze security headers and SSL
            configuration, assess risk, and receive intelligent remediation recommendations.
          </p>

          <div className="hero-buttons">
            <Link to={token ? "/scanner" : "/register"} className="btn-primary">
              <FiShield className="btn-icon" />
              Start Free Scan
              <FiArrowRight className="btn-arrow" />
            </Link>

            <Link to={token ? "/dashboard" : "/login"} className="btn-secondary">
              <FiActivity className="btn-icon" />
              Explore Dashboard
            </Link>
          </div>

          <div className="hero-trust-proof">
            <div className="trust-item">
              <FiCheck className="trust-icon" />
              <span>No agent installation required</span>
            </div>
            <div className="trust-item">
              <FiCheck className="trust-icon" />
              <span>Instant AI risk telemetry</span>
            </div>
            <div className="trust-item">
              <FiCheck className="trust-icon" />
              <span>Full user data isolation</span>
            </div>
          </div>
        </div>

        {/* Right Column: Miniature Security Dashboard Mockup */}
        <div className="hero-visual-wrapper">
          <div className="cyber-glow-bg"></div>

          <div className="mini-dashboard-card">
            {/* Animated Scanning Beam */}
            <div className="scanning-beam"></div>

            {/* Window Topbar */}
            <div className="window-header">
              <div className="window-controls">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="window-title">
                <FiLock className="window-lock-icon" />
                <span className="target-url">https://app.secure-enterprise.io</span>
              </div>
              <span className="live-status-pill">
                <span className="pulsing-dot green"></span>
                LIVE AUDIT
              </span>
            </div>

            {/* Score and Primary Metrics Banner */}
            <div className="mini-metrics-banner">
              <div className="score-radial-box">
                <div className="score-circle">
                  <span className="score-num">92</span>
                  <span className="score-total">/100</span>
                </div>
                <div className="score-label">
                  <div className="score-title">Security Score</div>
                  <div className="score-sub">OPTIMAL POSTURE</div>
                </div>
              </div>

              <div className="risk-level-badge low">
                <FiShield className="shield-icon" />
                <div>
                  <span className="risk-tag">RISK LEVEL</span>
                  <span className="risk-name">LOW RISK</span>
                </div>
              </div>
            </div>

            {/* Security Checks Grid */}
            <div className="mini-grid">
              <div className="mini-stat-card">
                <div className="stat-header">
                  <FiLock className="stat-icon cyan" />
                  <span className="stat-name">SSL / TLS</span>
                </div>
                <div className="stat-value text-green">
                  <FiCheckCircle className="check-icon" />
                  Secure (TLS 1.3)
                </div>
              </div>

              <div className="mini-stat-card">
                <div className="stat-header">
                  <FiShield className="stat-icon blue" />
                  <span className="stat-name">Security Headers</span>
                </div>
                <div className="stat-value text-blue">8 / 10 Enforced</div>
              </div>

              <div className="mini-stat-card">
                <div className="stat-header">
                  <FiActivity className="stat-icon emerald" />
                  <span className="stat-name">XSS Protection</span>
                </div>
                <div className="stat-value text-green">
                  <FiCheckCircle className="check-icon" />
                  Protected
                </div>
              </div>

              <div className="mini-stat-card">
                <div className="stat-header">
                  <FiAlertTriangle className="stat-icon purple" />
                  <span className="stat-name">SQL Injection</span>
                </div>
                <div className="stat-value text-green">
                  <FiCheckCircle className="check-icon" />
                  Protected
                </div>
              </div>
            </div>

            {/* Live Terminal Activity Feed */}
            <div className="mini-terminal">
              <div className="terminal-header">
                <FiTerminal className="terminal-icon" />
                <span>REAL-TIME AUDIT LOG</span>
                <span className="terminal-tag">AI ENGINE</span>
              </div>
              <div className="terminal-logs">
                <div className="log-line">
                  <span className="log-time">[16:42:01]</span>
                  <span className="log-cyan">GET /</span> Target active & responsive (200 OK)
                </div>
                <div className="log-line">
                  <span className="log-time">[16:42:02]</span>
                  <span className="log-green">✓ SSL:</span> Certificate valid for 82 days (RSA 2048)
                </div>
                <div className="log-line">
                  <span className="log-time">[16:42:03]</span>
                  <span className="log-green">✓ HEADERS:</span> HSTS, X-Frame-Options, CSP verified
                </div>
                <div className="log-line">
                  <span className="log-time">[16:42:04]</span>
                  <span className="log-purple">⚡ AI:</span> Threat assessment complete. Score: 92/100
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
