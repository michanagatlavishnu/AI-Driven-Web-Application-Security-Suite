const axios = require("axios");
const { default: sslChecker } = require("ssl-checker");
const { URL } = require("url");
const whois = require("whois-json");
const analyzeWithAI = require("./aiAnalyzer");

const scanWebsite = async (rawUrl) => {
  let url = (rawUrl || "").trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  try {
    // ----------------------------
    // Fetch Website
    // ----------------------------
    const startTime = Date.now();

    const response = await axios.get(url, {
      maxRedirects: 5,
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AISecuritySuite/1.0",
      },
      validateStatus: () => true, // Don't throw on 4xx/5xx responses
    });

    const responseTime = Date.now() - startTime;
    const statusCode = response.status;
    const headers = response.headers || {};

    // ----------------------------
    // HTTP Information
    // ----------------------------
    const httpInfo = {
      statusCode,
      statusText: response.statusText,
      responseTime: `${responseTime} ms`,
      server: headers["server"] || "Unknown",
      contentType: headers["content-type"] || "Unknown",
      protocol: url.startsWith("https") ? "HTTPS" : "HTTP",
    };

    const html = typeof response.data === "string" ? response.data : "";

    // ----------------------------
    // Technology Detection
    // ----------------------------
    const technologies = [];

    if (headers["server"]) {
      technologies.push(`Server: ${headers["server"]}`);
    }

    if (headers["x-powered-by"]) {
      technologies.push(`Powered-By: ${headers["x-powered-by"]}`);
    }

    if (headers["cf-ray"]) {
      technologies.push("Cloudflare CDN");
    }

    if (html.includes("__NEXT_DATA__")) {
      technologies.push("Next.js");
    }

    if (html.toLowerCase().includes("react")) {
      technologies.push("React");
    }

    if (html.toLowerCase().includes("angular")) {
      technologies.push("Angular");
    }

    if (html.toLowerCase().includes("vue")) {
      technologies.push("Vue.js");
    }

    if (html.toLowerCase().includes("wp-content")) {
      technologies.push("WordPress");
    }

    if (html.toLowerCase().includes("bootstrap")) {
      technologies.push("Bootstrap");
    }

    if (html.toLowerCase().includes("jquery")) {
      technologies.push("jQuery");
    }

    if (technologies.length === 0) {
      technologies.push("Technology Not Detected");
    }

    // ----------------------------
    // Security Headers
    // ----------------------------
    const securityHeaders = {
      "Content-Security-Policy": headers["content-security-policy"] ? "Present" : "Missing",
      "Strict-Transport-Security": headers["strict-transport-security"] ? "Present" : "Missing",
      "X-Frame-Options": headers["x-frame-options"] ? "Present" : "Missing",
      "X-Content-Type-Options": headers["x-content-type-options"] ? "Present" : "Missing",
      "Referrer-Policy": headers["referrer-policy"] ? "Present" : "Missing",
      "Permissions-Policy": headers["permissions-policy"] ? "Present" : "Missing",
    };

    // ----------------------------
    // Hostname
    // ----------------------------
    const hostname = new URL(url).hostname;

    // ----------------------------
    // WHOIS Information
    // ----------------------------
    let domainInfo = {
      domain: hostname,
      registrar: "Unknown",
      country: "Unknown",
      created: "Unknown",
      expires: "Unknown",
    };

    try {
      const info = await whois(hostname);
      if (info) {
        domainInfo = {
          domain: hostname,
          registrar: info.registrar || info.Registrar || "Unknown",
          country: info.country || info.Country || "Unknown",
          created: info.creationDate || info.created || info.createdDate || "Unknown",
          expires: info.registryExpiryDate || info.expirationDate || info.expires || "Unknown",
        };
      }
    } catch (err) {
      // WHOIS lookup failed - non fatal
    }

    // ----------------------------
    // SSL Certificate
    // ----------------------------
    let sslInfo = {
      status: "Not Available",
      issuer: "Unknown",
      validFrom: "-",
      validTo: "-",
      daysRemaining: 0,
    };

    try {
      const ssl = await sslChecker(hostname);
      if (ssl) {
        sslInfo = {
          status: ssl.valid ? "Valid" : "Invalid",
          issuer: ssl.issuer?.O || ssl.issuer?.CN || "Unknown",
          validFrom: ssl.validFrom ? new Date(ssl.validFrom).toLocaleDateString() : "-",
          validTo: ssl.validTo ? new Date(ssl.validTo).toLocaleDateString() : "-",
          daysRemaining: ssl.daysRemaining || 0,
        };
      }
    } catch (err) {
      // SSL check failed - non fatal
    }

    // ----------------------------
    // Security Scoring & Rule Deductions
    // ----------------------------
    let score = 100;
    let vulnerabilities = [];
    let recommendations = [];
    let missingHeaders = [];

    // Content Security Policy
    if (!headers["content-security-policy"]) {
      vulnerabilities.push("Missing Content Security Policy");
      recommendations.push("Add Content Security Policy (CSP)");
      missingHeaders.push("Content-Security-Policy");
      score -= 25;
    }

    // HSTS
    if (!headers["strict-transport-security"]) {
      vulnerabilities.push("Missing HSTS Header");
      recommendations.push("Enable HSTS Header (Strict-Transport-Security)");
      missingHeaders.push("Strict-Transport-Security");
      score -= 25;
    }

    // X-Frame-Options
    if (!headers["x-frame-options"]) {
      vulnerabilities.push("Missing X-Frame-Options (Clickjacking Risk)");
      recommendations.push("Add X-Frame-Options: SAMEORIGIN or DENY");
      missingHeaders.push("X-Frame-Options");
      score -= 25;
    }

    // X-Content-Type-Options
    if (!headers["x-content-type-options"]) {
      vulnerabilities.push("Missing X-Content-Type-Options");
      recommendations.push("Add X-Content-Type-Options: nosniff");
      missingHeaders.push("X-Content-Type-Options");
      score -= 25;
    }

    // Referrer Policy
    if (!headers["referrer-policy"]) {
      vulnerabilities.push("Missing Referrer Policy");
      recommendations.push("Add Referrer-Policy: strict-origin-when-cross-origin");
      missingHeaders.push("Referrer-Policy");
      score -= 10;
    }

    // Permissions Policy
    if (!headers["permissions-policy"]) {
      vulnerabilities.push("Missing Permissions Policy");
      recommendations.push("Add Permissions-Policy Header");
      missingHeaders.push("Permissions-Policy");
      score -= 10;
    }

    // Score floor
    if (score < 0) score = 0;

    // Risk classification
    let riskLevel = "Low";
    if (score >= 80) {
      riskLevel = "Low";
    } else if (score >= 50) {
      riskLevel = "Medium";
    } else {
      riskLevel = "High";
    }

    if (vulnerabilities.length === 0) {
      vulnerabilities.push("No major vulnerabilities detected");
      recommendations.push("Website follows good baseline security practices.");
    }

    // ----------------------------
    // Optional AI Analysis (Gemini)
    // ----------------------------
    const aiAnalysis = await analyzeWithAI({
      url,
      score,
      riskLevel,
      vulnerabilities: vulnerabilities.join(", "),
      missingHeaders,
      technologies,
      ssl: sslInfo,
    });

    return {
      url,
      score,
      riskLevel,
      vulnerabilities: vulnerabilities.join(", "),
      recommendations,
      ssl: sslInfo,
      domain: domainInfo,
      headers: securityHeaders,
      technologies,
      statusCode,
      responseTime,
      httpInfo,
      aiAnalysis,
    };
  } catch (error) {
    return {
      url,
      score: 0,
      riskLevel: "High",
      vulnerabilities: "Website not reachable or invalid URL",
      recommendations: ["Check whether the website is online and reachable."],
      ssl: {
        status: "Not Available",
        issuer: "-",
        validFrom: "-",
        validTo: "-",
        daysRemaining: 0,
      },
      domain: {
        domain: "-",
        registrar: "-",
        country: "-",
        created: "-",
        expires: "-",
      },
      headers: {
        "Content-Security-Policy": "Unknown",
        "Strict-Transport-Security": "Unknown",
        "X-Frame-Options": "Unknown",
        "X-Content-Type-Options": "Unknown",
        "Referrer-Policy": "Unknown",
        "Permissions-Policy": "Unknown",
      },
      technologies: ["Unknown"],
      statusCode: "-",
      responseTime: "-",
      httpInfo: {
        statusCode: "-",
        statusText: "-",
        responseTime: "-",
        server: "-",
        contentType: "-",
        protocol: "-",
      },
      aiAnalysis: {
        aiEnabled: false,
        status: "offline",
        message: "Target host could not be reached.",
      },
    };
  }
};

module.exports = scanWebsite;