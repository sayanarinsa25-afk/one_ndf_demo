import { useState } from "react";
import Layout from "../components/Layout";

import "../styles/leads.css";

export default function Leads() {
  const [search, setSearch] = useState("");

  // 🔥 FULL BACKEND DATA MOVED HERE
  const leads = [
    {
      name: "YOGANA",
      email: "yoganavinoth@gmail.com",
      loan: "₹5,000",
      type: "Construction",
      income: "₹500/mo",
      score: 70,
      status: "Lead",
    },
    {
      name: "Priya Patel",
      email: "priya.patel@outlook.com",
      loan: "₹32,00,000",
      type: "Home Purchase",
      income: "₹95,000/mo",
      score: 75,
      status: "Under Review",
    },
    {
      name: "Amit Singh Chauhan",
      email: "amit.chauhan@yahoo.com",
      loan: "₹75,00,000",
      type: "Construction",
      income: "₹2,10,000/mo",
      score: 68,
      status: "Lead",
    },
    {
      name: "Sneha Reddy",
      email: "sneha.reddy@gmail.com",
      loan: "₹28,00,000",
      type: "Renovation",
      income: "₹78,000/mo",
      score: 71,
      status: "Approved",
    },
    {
      name: "Vikram Desai",
      email: "vikram.desai@hotmail.com",
      loan: "₹1,20,00,000",
      type: "Home Purchase",
      income: "₹3,20,000/mo",
      score: 88,
      status: "Approved",
    },
    {
      name: "Anjali Mehta",
      email: "anjali.mehta@gmail.com",
      loan: "₹18,00,000",
      type: "Balance Transfer",
      income: "₹45,000/mo",
      score: 42,
      status: "Rejected",
    },
    {
      name: "Ravi Kumar Sharma",
      email: "ravi.sharma@gmail.com",
      loan: "₹45,00,000",
      type: "Home Purchase",
      income: "₹1,25,000/mo",
      score: 82,
      status: "Docs Pending",
    },
    {
      name: "Deepika Nair",
      email: "deepika.nair@gmail.com",
      loan: "₹62,00,000",
      type: "Construction",
      income: "₹1,85,000/mo",
      score: 84,
      status: "Under Review",
    },
    {
      name: "Suresh Gupta",
      email: "suresh.gupta@yahoo.com",
      loan: "₹9,50,000",
      type: "Renovation",
      income: "₹28,000/mo",
      score: 35,
      status: "Rejected",
    },
    {
      name: "Kavita Joshi",
      email: "kavita.joshi@gmail.com",
      loan: "₹38,00,000",
      type: "Home Purchase",
      income: "₹1,10,000/mo",
      score: 76,
      status: "Lead",
    },
    {
      name: "Manish Tiwari",
      email: "manish.tiwari@outlook.com",
      loan: "₹42,00,000",
      type: "Home Purchase",
      income: "₹1,30,000/mo",
      score: 80,
      status: "Lead",
    },
    {
      name: "Pooja Saxena",
      email: "pooja.saxena@gmail.com",
      loan: "₹21,00,000",
      type: "Balance Transfer",
      income: "₹62,000/mo",
      score: 55,
      status: "Docs Pending",
    },
  ];

  // 🔍 Search Filter (same logic preserved)
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