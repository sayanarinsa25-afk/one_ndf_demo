import Layout from "../components/Layout";
import "../styles/risk.css";

/* ================= STATIC DATA ================= */

const applicants = [
  {
    name: "Rahul Sharma",
    pan: "ABCDE1234F",
    credit: 720,
    foir: "32%",
    risk: 78,
    category: "Low",
    decision: "Approve",
  },
  {
    name: "Priya Verma",
    pan: "PQRSV5678K",
    credit: 640,
    foir: "48%",
    risk: 55,
    category: "Medium",
    decision: "Conditional",
  },
  {
    name: "Amit Das",
    pan: "LMNOP4321Z",
    credit: 580,
    foir: "62%",
    risk: 35,
    category: "High",
    decision: "Reject",
  },
];

export default function Risk() {
  /* ================= CALCULATIONS ================= */

  const averageRisk = Math.round(
    applicants.reduce((sum, a) => sum + a.risk, 0) / applicants.length
  );

  const distribution = {
    low: applicants.filter((a) => a.category === "Low").length,
    medium: applicants.filter((a) => a.category === "Medium").length,
    high: applicants.filter((a) => a.category === "High").length,
  };

  const riskClass = (risk: number) => {
    if (risk >= 70) return "risk green";
    if (risk >= 40) return "risk yellow";
    return "risk red";
  };

  return (
    <Layout>
      <div className="risk-page">
        <h1 className="page-title">Risk & Credit Engine</h1>

        {/* ================= Summary Section ================= */}
        <div className="risk-summary">
          {/* Gauge */}
          <div className="gauge-card">
            <svg width="130" height="130">
              <circle
                cx="65"
                cy="65"
                r="54"
                strokeWidth="10"
                className="gauge-bg"
                fill="none"
              />
              <circle
                cx="65"
                cy="65"
                r="54"
                strokeWidth="10"
                fill="none"
                strokeDasharray={`${averageRisk * 3.14} 340`}
                className="gauge-fill"
                transform="rotate(-90 65 65)"
              />
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="gauge-text"
              >
                {averageRisk}
              </text>
            </svg>
            <p className="gauge-label">Average Risk Score</p>
          </div>

          {/* Distribution Cards */}
          {[
            ["Low Risk (≥70)", distribution.low, "green"],
            ["Medium (40–69)", distribution.medium, "yellow"],
            ["High (<40)", distribution.high, "red"],
          ].map(([label, value, color]) => (
            <div key={label as string} className="dist-card">
              <div className="dist-label">{label}</div>
              <div className={`dist-value ${color}`}>{value}</div>
            </div>
          ))}
        </div>

        {/* ================= Applicants Table ================= */}
        <div className="table-card">
          <table className="risk-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Credit Score</th>
                <th>FOIR</th>
                <th>Risk Score</th>
                <th>Category</th>
                <th>Decision</th>
              </tr>
            </thead>

            <tbody>
              {applicants.map((a, i) => (
                <tr key={i}>
                  <td>
                    <div className="applicant-name">{a.name}</div>
                    <div className="muted">{a.pan}</div>
                  </td>

                  <td className="bold">{a.credit}</td>
                  <td>{a.foir}</td>

                  {/* Risk Circle */}
                  <td>
                    <div className={riskClass(a.risk)}>
                      <svg width="42" height="42">
                        <circle
                          cx="21"
                          cy="21"
                          r="16"
                          strokeWidth="4"
                          className="risk-bg"
                          fill="none"
                        />
                        <circle
                          cx="21"
                          cy="21"
                          r="16"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${a.risk} 100`}
                          className="risk-fill"
                          transform="rotate(-90 21 21)"
                        />
                        <text
                          x="50%"
                          y="50%"
                          dominantBaseline="middle"
                          textAnchor="middle"
                          className="risk-text"
                        >
                          {a.risk}
                        </text>
                      </svg>
                    </div>
                  </td>

                  <td className="bold">{a.category}</td>
                  <td>{a.decision}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {applicants.length === 0 && (
            <div className="empty">No applicants available.</div>
          )}
        </div>
      </div>
    </Layout>
  );
}