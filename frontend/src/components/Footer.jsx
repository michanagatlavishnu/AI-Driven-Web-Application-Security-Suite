import React from "react";
import { Link } from "react-router-dom";
import { FiShield, FiLock, FiCheckCircle } from "react-icons/fi";

function Footer() {
  const currentYear = 2026;

  return (
    <footer id="about" className="saas-footer">
      <div className="footer-top-divider"></div>

      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand">
              <div className="footer-logo-box">
                <FiShield className="footer-shield-icon" />
              </div>
              <span className="footer-brand-name">Security Suite</span>
            </Link>
            <p className="footer-tagline">
              AI-Driven Web Application Security Suite
            </p>
            <p className="footer-desc">
              AI-powered security analysis for modern web applications. Protect your digital perimeter
              with continuous vulnerability detection, SSL audits, and intelligent remediation.
            </p>
            <div className="footer-status-pill">
              <span className="pulsing-dot green"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="footer-col">
            <h4 className="footer-col-title">Product</h4>
            <ul className="footer-links">
              <li>
                <Link to="/scanner">Scanner</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/reports">Reports</Link>
              </li>
              <li>
                <a href="#features">Security Analysis</a>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform */}
          <div className="footer-col">
            <h4 className="footer-col-title">Platform</h4>
            <ul className="footer-links">
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#how-it-works">How It Works</a>
              </li>
              <li>
                <a href="#security">Security</a>
              </li>
              <li>
                <a href="#features">Documentation</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Account */}
          <div className="footer-col">
            <h4 className="footer-col-title">Account</h4>
            <ul className="footer-links">
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/dashboard">Console</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} AI-Driven Web Application Security Suite. All rights reserved.
          </p>
          <div className="footer-meta">
            <span className="footer-meta-item">
              <FiLock className="meta-icon" /> End-to-End TLS Encrypted
            </span>
            <span className="footer-meta-item">
              <FiCheckCircle className="meta-icon text-green" /> User Tenant Isolation
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
