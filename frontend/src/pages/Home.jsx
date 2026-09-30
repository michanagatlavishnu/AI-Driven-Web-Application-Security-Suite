import { Link } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <div style={{ fontSize: "56px", color: "#60a5fa", marginBottom: "15px" }}>
        <FaShieldAlt />
      </div>

      <h1>AI-Driven Web Application Security Suite</h1>

      <h2>Protect Your Web Applications</h2>

      <p>
        Scan websites, detect vulnerabilities, evaluate SSL & security headers, and get
        intelligent remediation recommendations.
      </p>

      <div className="buttons">
        <Link to="/login">
          <button>Login</button>
        </Link>

        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;