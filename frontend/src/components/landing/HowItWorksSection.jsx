import React from "react";
import { FiGlobe, FiCpu, FiFileText, FiZap } from "react-icons/fi";

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Enter Website",
      description: "Provide the URL of the web application you want to analyze.",
      icon: <FiGlobe />,
      color: "#06b6d4",
    },
    {
      number: "02",
      title: "Run Security Scan",
      description: "Our security engine analyzes the target across headers, ports, and certificates.",
      icon: <FiZap />,
      color: "#3b82f6",
    },
    {
      number: "03",
      title: "AI Analysis",
      description: "Security findings are evaluated, correlated, and prioritized with AI intelligence.",
      icon: <FiCpu />,
      color: "#a855f7",
    },
    {
      number: "04",
      title: "Get Security Report",
      description: "Review vulnerabilities, risk score and downloadable remediation recommendations.",
      icon: <FiFileText />,
      color: "#10b981",
    },
  ];

  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-pill">SIMPLIFIED WORKFLOW</span>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            From entering your target endpoint to receiving an enterprise-grade vulnerability report in four simple steps.
          </p>
        </div>

        <div className="steps-container">
          <div className="steps-connecting-line"></div>

          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number-badge" style={{ borderColor: step.color }}>
                  <span className="step-num" style={{ color: step.color }}>
                    {step.number}
                  </span>
                  <div className="step-icon-inner" style={{ color: step.color }}>
                    {step.icon}
                  </div>
                </div>

                <div className="step-body">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
