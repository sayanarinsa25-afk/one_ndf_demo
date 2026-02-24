// remove useState completely
import Layout from "../components/Layout";

import "../styles/pipeline.css";

export default function Pipeline() {
  // 🔥 FULL BACKEND DATA MOVED HERE
  const data = {
    stages: {
      "Lead Intake": 4,
      Documents: 2,
      "ML Review": 2,
      Approved: 2,
      Rejected: 2,
      Disbursed: 0,
    },
    applications: [
      {
        name: "Priya Patel",
        credit: 742,
        pan: "BXKPP4521A",
        salary: "₹95,000",
        foir: "16%",
        risk: 72,
        decision: null,
        status: "Under Review",
      },
      {
        name: "Sneha Reddy",
        credit: 780,
        pan: "CVLSR8634K",
        salary: "₹78,000",
        foir: "10%",
        risk: 85,
        decision: "Approve",
        status: "Approved",
      },
      {
        name: "Vikram Desai",
        credit: 810,
        pan: "AHJPD6677M",
        salary: "₹3,20,000",
        foir: "14%",
        risk: 91,
        decision: "Approve",
        status: "Approved",
      },
      {
        name: "Anjali Mehta",
        credit: 580,
        pan: "DMMPM3345L",
        salary: "₹45,000",
        foir: "49%",
        risk: 28,
        decision: "Reject",
        status: "Rejected",
      },
      {
        name: "Ravi Kumar Sharma",
        credit: 720,
        pan: "AEXPS7823N",
        salary: "₹1,25,000",
        foir: "14%",
        risk: 74,
        decision: null,
        status: "Docs Pending",
      },
      {
        name: "Rajesh Iyer",
        credit: 695,
        pan: "BKKRT9912H",
        salary: "₹1,55,000",
        foir: "16%",
        risk: 62,
        decision: null,
        status: "Docs Pending",
      },
      {
        name: "Deepika Nair",
        credit: 755,
        pan: "CANDN5567P",
        salary: "₹1,85,000",
        foir: "6%",
        risk: 81,
        decision: null,
        status: "Under Review",
      },
    ],
  };

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