import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/landing/HeroSection";
import MetricsSection from "../components/landing/MetricsSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import DashboardPreviewSection from "../components/landing/DashboardPreviewSection";
import AISecuritySection from "../components/landing/AISecuritySection";
import TrustSection from "../components/landing/TrustSection";
import CTASection from "../components/landing/CTASection";
import "./Home.css";

function Home() {
  return (
    <div className="landing-page-root">
      {/* Background Cyber Ambient Lights */}
      <div className="cyber-ambient-bg">
        <div className="ambient-orb orb-primary"></div>
        <div className="ambient-orb orb-secondary"></div>
        <div className="ambient-orb orb-purple"></div>
        <div className="cyber-grid-overlay"></div>
      </div>

      {/* Sticky Navigation */}
      <Navbar />

      {/* Main Landing Sections */}
      <main className="landing-content">
        <HeroSection />
        <MetricsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DashboardPreviewSection />
        <AISecuritySection />
        <TrustSection />
        <CTASection />
      </main>

      {/* Enterprise SaaS Footer */}
      <Footer />
    </div>
  );
}

export default Home;