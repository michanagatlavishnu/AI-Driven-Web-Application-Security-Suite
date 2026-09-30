const axios = require("axios");

/**
 * AI-Driven Security Analyzer
 * Uses Google Gemini API when configured in GEMINI_API_KEY.
 * Gracefully falls back to rule-based analysis if the API key is not provided or if the service is unreachable.
 */
async function analyzeWithAI(scanData) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
    return {
      aiEnabled: false,
      status: "standby",
      message: "AI analysis standby. Add GEMINI_API_KEY in backend/.env to enable automated AI threat assessment and remediation code generation.",
      insights: null,
      remediationSnippet: null,
    };
  }

  try {
    const prompt = `You are a Senior Web Application Security Auditor.
Analyze the following vulnerability scan results for the website: ${scanData.url}
- Score: ${scanData.score}/100
- Risk Level: ${scanData.riskLevel}
- Vulnerabilities: ${scanData.vulnerabilities}
- Missing Headers: ${JSON.stringify(scanData.missingHeaders || [])}
- Technologies: ${JSON.stringify(scanData.technologies || [])}
- SSL Status: ${scanData.ssl?.status} (${scanData.ssl?.daysRemaining} days remaining)

Provide a concise, practical, high-value assessment formatted in clean Markdown:
1. **Threat Impact**: Briefly explain what real-world attacks are possible with these missing defenses (e.g. Clickjacking, MIME sniffing, MITM, XSS escalation).
2. **Remediation Configuration**: Provide an exact, copy-pasteable configuration snippet (e.g., Nginx, Apache, or Express helmet) to fix the missing headers.
Keep the response under 250 words, professional and actionable.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 8000, // 8-second safety timeout
      }
    );

    const candidate = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidate) {
      return {
        aiEnabled: true,
        status: "active",
        model: "Gemini 1.5 Flash",
        insights: candidate,
      };
    }

    return {
      aiEnabled: false,
      status: "fallback",
      message: "AI returned empty response; rule-based analysis used.",
    };
  } catch (error) {
    console.warn("AI Analysis notice (non-fatal):", error.response?.data?.error?.message || error.message);
    return {
      aiEnabled: false,
      status: "error",
      message: "AI analysis unavailable; completed using rule-based scanner.",
    };
  }
}

module.exports = analyzeWithAI;
