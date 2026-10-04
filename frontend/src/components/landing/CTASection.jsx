import React from "react";
import { Link } from "react-router-dom";
import { FiShield, FiArrowRight, FiActivity } from "react-icons/fi";

function CTASection() {
  const token = localStorage.getItem("token");

  return (
    <section className="cta-section">
      <div className="section-container">
        <div className="cta-banner">
          {/* Subtle animated shield / glow background */}
          <div className="cta-glow-backdrop"></div>
          <div className="cta-shield-watermark">
            <FiShield />
          </div>

          <div className="cta-content">
            <span className="section-pill cyan">GET STARTED IN MINUTES</span>
            <h2 className="cta-title">Ready to Secure Your Web Application?</h2>
            <p className="cta-subtitle">
              Run your first security assessment and discover vulnerabilities before attackers do.
              Fast, automated, and powered by intelligent AI threat evaluation.
            </p>

            <div className="cta-buttons">
              <Link to={token ? "/scanner" : "/register"} className="btn-primary cta-btn">
                <FiShield className="btn-icon" />
                Start Security Scan
                <FiArrowRight className="btn-arrow" />
              </Link>

              <Link to={token ? "/dashboard" : "/login"} className="btn-secondary cta-btn">
                <FiActivity className="btn-icon" />
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
