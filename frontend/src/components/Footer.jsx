import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#060e22",
        borderTop: "1px solid #1e3a8a30",
        padding: "20px",
        textAlign: "center",
        color: "#64748b",
        fontSize: "14px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <p style={{ margin: "4px 0", color: "#94a3b8" }}>
          🛡 <strong>AI-Driven Web Application Security Suite</strong>
        </p>
        <p style={{ margin: "4px 0" }}>
          Automated Vulnerability Detection, SSL Auditing & Defensive Recommendations © {currentYear}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
