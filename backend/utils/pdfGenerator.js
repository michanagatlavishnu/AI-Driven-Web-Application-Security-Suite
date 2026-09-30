const PDFDocument = require("pdfkit");

const generatePDF = (scan, res) => {
  const doc = new PDFDocument({ margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Security_Report_${scan.id || "scan"}.pdf`
  );

  doc.pipe(res);

  // Header Title
  doc.fontSize(22).fillColor("#08142e").text("🛡 AI Security Suite Report", {
    align: "center",
  });
  doc.moveDown(0.5);

  doc.fontSize(11).fillColor("#666666").text("Comprehensive Web Application Security Audit", {
    align: "center",
  });
  doc.moveDown(1.5);

  // Divider
  doc.strokeColor("#cccccc").lineWidth(1).moveTo(40, doc.y).lineTo(570, doc.y).stroke();
  doc.moveDown(1);

  // Overview Info
  doc.fontSize(13).fillColor("#000000");
  doc.text(`Target Website: ${scan.url}`);
  doc.moveDown(0.4);

  const score = scan.score !== undefined ? scan.score : 0;
  doc.text(`Security Score: ${score}/100`);
  doc.moveDown(0.4);

  const riskColor = scan.risk_level === "Low" ? "#16a34a" : scan.risk_level === "Medium" ? "#d97706" : "#dc2626";
  doc.fillColor(riskColor).text(`Risk Level: ${scan.risk_level || "Unknown"}`);
  doc.fillColor("#000000");
  doc.moveDown(0.4);

  if (scan.status_code) {
    doc.text(`HTTP Status: ${scan.status_code} | Response Time: ${scan.response_time || "N/A"}`);
    doc.moveDown(0.4);
  }

  // Vulnerabilities Section
  doc.moveDown(0.6);
  doc.fontSize(14).fillColor("#08142e").text("Detected Vulnerabilities / Missing Defenses:");
  doc.fontSize(11).fillColor("#333333");
  doc.moveDown(0.3);

  const vulns = (scan.vulnerabilities || "None detected")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  vulns.forEach((v) => {
    doc.text(`• ${v}`);
    doc.moveDown(0.2);
  });

  // Recommendations Section
  doc.moveDown(0.6);
  doc.fontSize(14).fillColor("#08142e").text("Security Recommendations:");
  doc.fontSize(11).fillColor("#333333");
  doc.moveDown(0.3);

  let recs = [];
  try {
    recs = typeof scan.recommendations === "string" ? JSON.parse(scan.recommendations) : scan.recommendations || [];
  } catch (e) {
    recs = [];
  }

  if (recs && recs.length > 0) {
    recs.forEach((r) => {
      doc.text(`• ${r}`);
      doc.moveDown(0.2);
    });
  } else {
    if (scan.risk_level === "Low") {
      doc.text("• Website implements standard security headers. Continue regular monitoring.");
    } else if (scan.risk_level === "Medium") {
      doc.text("• Implement missing HTTP defensive headers to harden application security.");
    } else {
      doc.text("• Immediate action required: enforce CSP, HSTS, and frame protections.");
    }
  }

  // Footer metadata
  doc.moveDown(1.5);
  doc.strokeColor("#cccccc").lineWidth(1).moveTo(40, doc.y).lineTo(570, doc.y).stroke();
  doc.moveDown(0.8);

  const dateStr = scan.scan_date ? new Date(scan.scan_date).toLocaleString() : new Date().toLocaleString();
  doc.fontSize(10).fillColor("#777777").text(`Scan Date: ${dateStr}`, { align: "left" });
  doc.text("Generated automatically by AI-Driven Web Application Security Suite", { align: "right" });

  doc.end();
};

module.exports = generatePDF;