import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import "../styles/dashboard.css";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    api.get("/dashboard/").then((res) => setData(res.data));

    const ws = new WebSocket("ws://localhost:8000/ws/dashboard");
    ws.onmessage = (e) => {
      const live = JSON.parse(e.data);
      setData((prev: any) => ({ ...prev, ...live }));
    };

    return () => ws.close();
  }, []);

  if (!data) {
    return (
      <Layout>
        <div className="dashboard loading">
          <div className="spinner" />
          <p>Loading analytics...</p>
        </div>
      </Layout>
    );
  }

  const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

  const statusColor = (status: string) => {
    if (status === "Approved") return "green";
    if (status === "Rejected") return "red";
    if (status === "Under Review") return "yellow";
    return "blue";
  };

  return (
    <Layout>
      <div className={dark ? "dashboard dark" : "dashboard"}>
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Financial Intelligence Dashboard</h1>
            <p className="dashboard-sub">
              Live monitoring of loan pipeline, approvals, disbursement risk, and
              operational performance
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setDark(!dark)}>
              {dark ? "Light Mode" : "Dark Mode"}
            </button>
            <button
  onClick={() =>
    window.open("http://127.0.0.1:8000/api/export-mis?type=pdf", "_blank")
  }
>
  PDF
</button>

<button
  onClick={() =>
    window.open("http://127.0.0.1:8000/api/export-mis?type=excel", "_blank")
  }
>
  Excel
</button>

          </div>
        </div>

        {/* AI Prediction Widget */}
        {data.ai_prediction && (
          <div className="card" style={{ marginBottom: 20 }}>
            <h2 className="section-title">AI Loan Approval Prediction</h2>
            <div style={{ display: "flex", gap: 40 }}>
              <div>
                <div className="kpi-label">Approval Probability</div>
                <div className="kpi-value green">
                  {data.ai_prediction.approval_probability * 100}%
                </div>
              </div>

              <div>
                <div className="kpi-label">Risk Level</div>
                <div className="kpi-value">{data.ai_prediction.risk}</div>
              </div>

              <div>
                <div className="kpi-label">Recommendation</div>
                <div className="kpi-value blue">
                  {data.ai_prediction.recommendation}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-4">
          {[
            ["Total Leads", data.stats.total_leads],
            ["Applications", data.stats.applications],
            ["Approval Rate", `${data.stats.approval_rate}%`],
            ["Avg Risk Score", data.stats.avg_risk_score],
          ].map(([label, value]) => (
            <div key={label as string} className="card kpi-card">
              <div className="kpi-label">{label}</div>
              <div className="kpi-value">{value}</div>
              <div className="kpi-trend">↗ Real‑time updated</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-3 section-gap">
          <div className="card span-2">
            <h2 className="section-title">Pipeline Growth Trend</h2>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="leads" stroke="#2563eb" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="applications" stroke="#22c55e" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h2 className="section-title">Risk Segmentation</h2>

            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Low", value: data.risk_distribution.low },
                    { name: "Medium", value: data.risk_distribution.medium },
                    { name: "High", value: data.risk_distribution.high },
                  ]}
                  dataKey="value"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {COLORS.map((c, i) => (
                    <Cell key={i} fill={c} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Stage Bar Chart */}
        <div className="grid grid-2 section-gap">
          <div className="card">
            <h2 className="section-title">Pipeline Stage Distribution</h2>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={Object.entries(data.pipeline_summary).map(([k, v]) => ({
                  stage: k,
                  value: v,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-1">
            <div className="card">
              <div className="kpi-label">Total Pipeline Value</div>
              <div className="kpi-value blue">{data.pipeline_value}</div>
            </div>

            <div className="card">
              <div className="kpi-label">Loans Approved</div>
              <div className="kpi-value green">{data.approved}</div>
            </div>

            <div className="card">
              <div className="kpi-label">Loans Rejected</div>
              <div className="kpi-value red">{data.rejected}</div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-2 section-gap">
          <div className="card">
            <h2 className="section-title">Recent Loan Applicants</h2>

            {data.recent_leads.map((lead: any, i: number) => (
              <div key={i} className="lead">
                <div className="lead-left">
                  <div className="avatar">{lead.name.charAt(0)}</div>

                  <div>
                    <div className="lead-name">{lead.name}</div>
                    <div className="lead-sub">
                      {lead.amount} • {lead.type}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span
                    className={`badge ${
                      lead.score > 70
                        ? "green"
                        : lead.score > 40
                        ? "yellow"
                        : "red"
                    }`}
                  >
                    {lead.score}
                  </span>

                  <span className={`badge ${statusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <h2 className="section-title">Operational Progress</h2>

            {Object.entries(data.pipeline_summary).map(([k, v]) => (
              <div key={k} className="summary-item">
                <div className="summary-top">
                  <span>{k}</span>
                  <span>{v as number}</span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(v as number) * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}