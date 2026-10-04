import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FiShield,
  FiMenu,
  FiX,
  FiActivity,
  FiSearch,
  FiFileText,
  FiClock,
  FiUser,
  FiLogOut,
  FiZap,
} from "react-icons/fi";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const token = localStorage.getItem("token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (e) {
    user = null;
  }

  // Track scroll for enhanced shadow/blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isLandingPage = location.pathname === "/";

  // Smooth scroll handler for anchor links
  const handleScrollTo = (id) => {
    setMobileMenuOpen(false);
    if (!isLandingPage) {
      navigate("/" + id);
      return;
    }
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`saas-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Brand / Logo */}
        <Link to="/" className="navbar-brand">
          <div className="logo-shield-box">
            <FiShield className="logo-shield-icon" />
          </div>
          <div className="brand-text-group">
            <span className="brand-title">Security Suite</span>
            <span className="brand-badge">AI-DRIVEN</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="desktop-nav-links">
          {token ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                <FiActivity className="nav-icon" /> Dashboard
              </NavLink>
              <NavLink to="/scanner" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                <FiSearch className="nav-icon" /> Scanner
              </NavLink>
              <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                <FiFileText className="nav-icon" /> Reports
              </NavLink>
              <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                <FiClock className="nav-icon" /> History
              </NavLink>
              {user?.role === "admin" && (
                <NavLink to="/admin" className={({ isActive }) => `nav-item admin-item ${isActive ? "active" : ""}`}>
                  <FiZap className="nav-icon" /> Admin
                </NavLink>
              )}
              <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                <FiUser className="nav-icon" /> {user?.name ? user.name.split(" ")[0] : "Profile"}
              </NavLink>
              <button onClick={handleLogout} className="btn-logout" title="Sign Out">
                <FiLogOut className="logout-icon" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className={`nav-item ${isLandingPage ? "active" : ""}`}>
                Home
              </Link>
              <a href="#features" onClick={(e) => { e.preventDefault(); handleScrollTo("#features"); }} className="nav-item">
                Features
              </a>
              <a href="#how-it-works" onClick={(e) => { e.preventDefault(); handleScrollTo("#how-it-works"); }} className="nav-item">
                How It Works
              </a>
              <a href="#security" onClick={(e) => { e.preventDefault(); handleScrollTo("#security"); }} className="nav-item">
                Security
              </a>
              <a href="#about" onClick={(e) => { e.preventDefault(); handleScrollTo("#about"); }} className="nav-item">
                About
              </a>

              <div className="nav-auth-buttons">
                <Link to="/login" className="btn-nav-login">
                  Login
                </Link>
                <Link to="/register" className="btn-nav-cta">
                  Get Started
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay">
          <div className="mobile-drawer-links">
            {token ? (
              <>
                <Link to="/dashboard" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                  <FiActivity className="nav-icon" /> Dashboard
                </Link>
                <Link to="/scanner" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                  <FiSearch className="nav-icon" /> Scanner
                </Link>
                <Link to="/reports" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                  <FiFileText className="nav-icon" /> Reports
                </Link>
                <Link to="/history" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                  <FiClock className="nav-icon" /> History
                </Link>
                {user?.role === "admin" && (
                  <Link to="/admin" className="mobile-nav-item admin-item" onClick={() => setMobileMenuOpen(false)}>
                    <FiZap className="nav-icon" /> Admin Panel
                  </Link>
                )}
                <Link to="/profile" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                  <FiUser className="nav-icon" /> Profile ({user?.name || "User"})
                </Link>
                <button onClick={handleLogout} className="mobile-logout-btn">
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
                <a href="#features" className="mobile-nav-item" onClick={(e) => { e.preventDefault(); handleScrollTo("#features"); }}>
                  Features
                </a>
                <a href="#how-it-works" className="mobile-nav-item" onClick={(e) => { e.preventDefault(); handleScrollTo("#how-it-works"); }}>
                  How It Works
                </a>
                <a href="#security" className="mobile-nav-item" onClick={(e) => { e.preventDefault(); handleScrollTo("#security"); }}>
                  Security
                </a>
                <a href="#about" className="mobile-nav-item" onClick={(e) => { e.preventDefault(); handleScrollTo("#about"); }}>
                  About
                </a>

                <div className="mobile-auth-actions">
                  <Link to="/login" className="mobile-btn-login" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="mobile-btn-cta" onClick={() => setMobileMenuOpen(false)}>
                    Get Started Free
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;