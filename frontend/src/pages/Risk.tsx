import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/client";

import "../styles/risk.css";

export default function Risk() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get("/risk/").then((res) => setData(res.data));
  }, []);

  if (!data) {
    return (
      <Layout>
        <div className="risk-loading">Loading risk engine...</div>
      </Layout>
    );
  }

  const riskClass = (risk: number) => {
    if (risk >= 70) return "risk green";
    if (risk >= 40) return "risk yellow";
    return "risk red";
  };

  return (
    <Layout>
      <div className="risk-page">
        <h1 className="page-title">Risk & Credit Engine</h1>

        {/* Top Summary */}
        <div className="risk-summary">
          {/* Average Gauge */}
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
                strokeDasharray={`${data.average_risk * 3.14} 340`}
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
                {data.average_risk}
              </text>
            </svg>

            <p className="gauge-label">Average Risk Score</p>
          </div>

          {/* Distribution Cards */}
          {[
            ["Low Risk (≥70)", data.distribution.low, "green"],
            ["Medium (40–69)", data.distribution.medium, "yellow"],
            ["High (<40)", data.distribution.high, "red"],
          ].map(([label, value, color]) => (
            <div key={label as string} className="dist-card">
              <div className="dist-label">{label}</div>
              <div className={`dist-value ${color}`}>{value}</div>
            </div>
          ))}
        </div>

        {/* Applicants Table */}
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
              {data.applicants.map((a: any, i: number) => (
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

          {data.applicants.length === 0 && (
            <div className="empty">No applicants available.</div>
          )}
        </div>
      </div>
    </Layout>
  );
}
