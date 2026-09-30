import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Load from local storage initially
    try {
      const localUser = JSON.parse(localStorage.getItem("user") || "null");
      if (localUser) setUser(localUser);
    } catch (e) {
      console.warn("Could not parse local user info", e);
    }

    // Fetch fresh profile from API
    const loadProfile = async () => {
      try {
        const [profileRes, statsRes] = await Promise.allSettled([
          api.get("/api/users/profile"),
          api.get("/api/scans/stats"),
        ]);

        if (profileRes.status === "fulfilled" && profileRes.value.data) {
          setUser(profileRes.value.data);
          localStorage.setItem("user", JSON.stringify(profileRes.value.data));
        }

        if (statsRes.status === "fulfilled" && statsRes.value.data) {
          setStats(statsRes.value.data);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      style={{
        background: "#08142e",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "white",
      }}
    >
      <Navbar />

      <main style={{ flex: 1, padding: "40px 20px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
          <h1 style={{ fontSize: "32px", margin: 0 }}>👤 User Profile</h1>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ← Back to Dashboard
          </button>
        </div>

        <div
          style={{
            background: "#10244d",
            padding: "35px",
            borderRadius: "12px",
            boxShadow: "0 0 15px rgba(0,0,0,0.5)",
            marginBottom: "30px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "25px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#2563eb",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "36px",
                fontWeight: "bold",
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 style={{ margin: "0 0 8px 0", color: "#60a5fa" }}>{user?.name || "Security Auditor"}</h2>
              <span
                style={{
                  background: "#16a34a25",
                  border: "1px solid #16a34a",
                  color: "#86efac",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                ● Active Auditor
              </span>
            </div>
          </div>

          <hr style={{ borderColor: "#1e3a8a40", margin: "20px 0" }} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            <div>
              <p style={{ color: "#94a3b8", margin: "0 0 4px 0", fontSize: "14px" }}>Full Name</p>
              <p style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>{user?.name || "Not provided"}</p>
            </div>

            <div>
              <p style={{ color: "#94a3b8", margin: "0 0 4px 0", fontSize: "14px" }}>Email Address</p>
              <p style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>{user?.email || "Not provided"}</p>
            </div>

            <div>
              <p style={{ color: "#94a3b8", margin: "0 0 4px 0", fontSize: "14px" }}>User ID</p>
              <p style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>#{user?.id || "—"}</p>
            </div>

            <div>
              <p style={{ color: "#94a3b8", margin: "0 0 4px 0", fontSize: "14px" }}>Member Since</p>
              <p style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Active Account"}
              </p>
            </div>
          </div>

          {stats && (
            <>
              <hr style={{ borderColor: "#1e3a8a40", margin: "25px 0" }} />
              <h3 style={{ color: "#60a5fa", marginBottom: "15px" }}>📊 Your Security Auditing Activity</h3>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <div style={{ background: "#0b1b3d", padding: "15px 25px", borderRadius: "8px", flex: 1, minWidth: "120px" }}>
                  <p style={{ color: "#94a3b8", margin: 0, fontSize: "13px" }}>Total Scans Conducted</p>
                  <h2 style={{ margin: "5px 0 0 0", color: "#60a5fa" }}>{stats.scans || 0}</h2>
                </div>
                <div style={{ background: "#0b1b3d", padding: "15px 25px", borderRadius: "8px", flex: 1, minWidth: "120px" }}>
                  <p style={{ color: "#94a3b8", margin: 0, fontSize: "13px" }}>Average Security Score</p>
                  <h2 style={{ margin: "5px 0 0 0", color: "#22c55e" }}>{stats.averageScore || 0}%</h2>
                </div>
              </div>
            </>
          )}

          <div style={{ marginTop: "30px", display: "flex", gap: "15px" }}>
            <button
              onClick={handleLogout}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;