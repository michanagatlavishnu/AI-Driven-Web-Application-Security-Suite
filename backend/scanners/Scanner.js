const axios = require("axios");

const scanWebsite = async (url) => {
  try {
    const response = await axios.get(url);

    const headers = response.headers;

    let riskLevel = "Low";
    let vulnerabilities = [];

    if (!headers["content-security-policy"]) {
      vulnerabilities.push("Missing Content Security Policy");
    }

    if (!headers["strict-transport-security"]) {
      vulnerabilities.push("Missing HSTS Header");
    }

    if (!headers["x-frame-options"]) {
      vulnerabilities.push("Missing X-Frame-Options");
    }

    if (!headers["x-content-type-options"]) {
      vulnerabilities.push("Missing X-Content-Type-Options");
    }

    if (vulnerabilities.length >= 3) {
      riskLevel = "High";
    } else if (vulnerabilities.length >= 1) {
      riskLevel = "Medium";
    }

    return {
      riskLevel,
      vulnerabilities:
        vulnerabilities.length > 0
          ? vulnerabilities.join(", ")
          : "No major vulnerabilities",
    };
  } catch (error) {
    return {
      riskLevel: "High",
      vulnerabilities: "Website not reachable",
    };
  }
};

module.exports = scanWebsite;