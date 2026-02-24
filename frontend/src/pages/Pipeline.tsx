import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/client";

import "../styles/pipeline.css";

export default function Pipeline() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get("/pipeline/").then((res) => setData(res.data));
  }, []);

  if (!data) {
    return (
      <Layout>
        <div className="pipeline-loading">Loading pipeline...</div>
      </Layout>
    );
  }

  const statusClass = (status: string) => {
    switch (status) {
      case "Approved":
        return "badge green";
      case "Rejected":
        return "badge red";
      case "Under Review":
        return "badge purple";
      case "Docs Pending":
        return "badge yellow";
      default:
        return "badge blue";
    }
  };

  const riskClass = (risk: number) => {
    if (risk >= 80) return "risk green";
    if (risk >= 50) return "risk yellow";
    return "risk red";
  };

  return (
    <Layout>
      <div className="pipeline-page">
        <h1 className="page-title">Application Pipeline</h1>

        {/* Stage Counters */}
        <div className="stage-grid">
          {Object.entries(data.stages).map(([k, v]) => (
            <div key={k} className="stage-card">
              <div className="stage-label">{k}</div>
              <div className="stage-value">{v as number}</div>
            </div>
          ))}
        </div>

        {/* Applications Table */}
        <div className="table-card">
          <table className="pipeline-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>PAN</th>
                <th>Salary</th>
                <th>FOIR</th>
                <th>Risk</th>
                <th>Decision</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.applications.map((app: any, i: number) => (
                <tr key={i}>
                  {/* Applicant */}
                  <td>
                    <div className="applicant-name">{app.name}</div>
                    <div className="muted">Credit: {app.credit}</div>
                  </td>

                  <td>{app.pan}</td>
                  <td>{app.salary}</td>
                  <td>{app.foir}</td>

                  {/* Risk Circle */}
                  <td>
                    <div className={riskClass(app.risk)}>
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
                          strokeDasharray={`${app.risk} 100`}
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
                          {app.risk}
                        </text>
                      </svg>
                    </div>
                  </td>

                  <td>{app.decision || "—"}</td>

                  {/* Status */}
                  <td>
                    <span className={statusClass(app.status)}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.applications.length === 0 && (
            <div className="empty">No applications found.</div>
          )}
        </div>
      </div>
    </Layout>
  );
}
