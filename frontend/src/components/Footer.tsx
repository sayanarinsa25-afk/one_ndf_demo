export default function Footer() {
  return (
    <footer
      style={{
        height: "56px",
        borderTop: "1px solid #e5e7eb",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        fontSize: "13px",
        color: "#6b7280",
      }}
    >
      {/* Left */}
      <div>© {new Date().getFullYear()} Finance AI Platform</div>

      {/* Center */}
      <div style={{ fontWeight: 500, color: "#374151" }}>
        AI-Powered Loan Automation & Risk Intelligence
      </div>

      {/* Right */}
      <div>
        Built by{" "}
        <span style={{ color: "#2563eb", fontWeight: 600 }}>
          ARINSA AI MINDS
        </span>
      </div>
    </footer>
  );
}
