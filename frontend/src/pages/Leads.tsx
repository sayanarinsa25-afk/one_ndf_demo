import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/client";

import "../styles/leads.css";

export default function Leads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/leads/").then((res) => setLeads(res.data));
  }, []);

  const filtered = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase())
  );

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

  return (
    <Layout>
      <div className="leads-page">
        <h1 className="page-title">Lead Management</h1>

        {/* Search */}
        <input
          placeholder="Search by name or email..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Table */}
        <div className="table-card">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Loan Details</th>
                <th>Income</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((lead, i) => (
                <tr key={i}>
                  <td>
                    <div className="lead-name">{lead.name}</div>
                    <div className="lead-email">{lead.email}</div>
                  </td>

                  <td>
                    <div>{lead.loan}</div>
                    <div className="muted">{lead.type}</div>
                  </td>

                  <td>{lead.income}</td>

                  <td className="score">{lead.score}</td>

                  <td>
                    <span className={statusClass(lead.status)}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="empty">No leads found.</div>
          )}
        </div>
      </div>
    </Layout>
  );
}
