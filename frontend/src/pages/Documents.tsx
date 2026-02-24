import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/client";
import "../styles/documents.css";

const DOC_TYPES = [
  "Aadhaar Card",
  "PAN Card",
  "Salary Slip",
  "Bank Statement",
  "ITR / Tax Return",
];

export default function Documents() {
  const [data, setData] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [docType, setDocType] = useState("");

  const load = () => api.get("/documents/").then((res) => setData(res.data));

  useEffect(() => {
    load();
  }, []);

  /* ---------- Upload ---------- */
  const upload = async () => {
    if (!file || !customerId || !customerName || !docType) return;

    const form = new FormData();
    form.append("file", file);
    form.append("customer_id", customerId);
    form.append("customer_name", customerName);
    form.append("type", docType);

    await api.post("/documents/upload", form);

    setFile(null);
    setCustomerId("");
    setCustomerName("");
    setDocType("");

    load();
  };

  /* ---------- Recalculate only for Pending ---------- */
  const recalcAutomation = (docId: string) => {
    setData((prev: any) => ({
      ...prev,
      documents: prev.documents.map((d: any) =>
        d.id === docId ? { ...d, status: "Processing" } : d
      ),
    }));

    setTimeout(() => {
      setData((prev: any) => ({
        ...prev,
        documents: prev.documents.map((d: any) =>
          d.id === docId
            ? {
                ...d,
                status: "Completed",
                fields: Math.floor(Math.random() * 6) + 3,
              }
            : d
        ),
      }));
    }, 1500);
  };

  if (!data) {
    return (
      <Layout>
        <div className="docs-loading">Loading documents...</div>
      </Layout>
    );
  }

  const statusClass = (status: string) => {
    if (status === "Completed") return "status green";
    if (status === "Processing") return "status blue";
    if (status === "Pending") return "status yellow";
    return "status red";
  };

  return (
    <Layout>
      <div className="docs-page">
        <h1 className="page-title">Document Processing</h1>

        {/* KPI */}
        <div className="kpi-grid">
          {[
            ["Total Documents", data.stats.total],
            ["OCR Completed", data.stats.completed],
            ["Pending", data.stats.pending],
            ["Failed", data.stats.failed],
          ].map(([label, value]) => (
            <div key={label as string} className="kpi-card">
              <div className="kpi-label">{label}</div>
              <div className="kpi-value">{value}</div>
            </div>
          ))}
        </div>

        {/* Upload Form */}
        <div className="upload-card">
          <div className="input-group">
            <label>Customer ID</label>
            <input
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="CUST-RAVI"
            />
          </div>

          <div className="input-group">
            <label>Customer Name</label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ravi Kumar"
            />
          </div>

          <div className="input-group">
            <label>Document Type</label>
            <select value={docType} onChange={(e) => setDocType(e.target.value)}>
              <option value="">Select Document Type</option>
              {DOC_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Upload File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <button className="upload-btn" onClick={upload}>
            Upload Document
          </button>
        </div>

        {/* Table */}
        <div className="table-card">
          <table className="docs-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer Name</th>
                <th>Document</th>
                <th>Type</th>
                <th>OCR Status</th>
                <th>Extracted Fields</th>
                <th>Automation</th>
              </tr>
            </thead>

            <tbody>
              {data.documents.map((doc: any) => (
                <tr key={doc.id}>
                  <td>{doc.customer_id}</td>
                  <td>{doc.customer_name}</td>
                  <td>{doc.name}</td>
                  <td>{doc.type}</td>
                  <td className={statusClass(doc.status)}>{doc.status}</td>
                  <td>
                    {doc.status === "Completed" ? `${doc.fields} fields` : "—"}
                  </td>
                  <td>
                    {doc.status === "Pending" ? (
                      <button
                        className="recalc-btn"
                        onClick={() => recalcAutomation(doc.id)}
                      >
                        Recalculate
                      </button>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.documents.length === 0 && (
            <div className="empty">No documents uploaded.</div>
          )}
        </div>
      </div>
    </Layout>
  );
}
