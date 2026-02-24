import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "../styles/documents.css";

const DOC_TYPES = [
  "Aadhaar Card",
  "PAN Card",
  "Salary Slip",
  "Bank Statement",
  "ITR / Tax Return",
];

// 🔥 Helper: Generate Random ID (like backend)
const generateId = () =>
  Math.random().toString(36).substring(2, 10).toUpperCase();

export default function Documents() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [docType, setDocType] = useState("");

  /* ==============================
     INITIAL DATA (Backend moved)
  ============================== */
  useEffect(() => {
    setDocuments([
      {
        id: generateId(),
        customer_id: "SN3H4A",
        customer_name: "Sneha Reddy",
        name: "sneha_reddy_aadhaar.pdf",
        type: "Aadhaar Card",
        status: "Completed",
        fields: 4,
      },
      {
        id: generateId(),
        customer_id: "SN3H4A",
        customer_name: "Sneha Reddy",
        name: "sneha_reddy_pan.pdf",
        type: "PAN Card",
        status: "Completed",
        fields: 3,
      },
      {
        id: generateId(),
        customer_id: "VK9R2M",
        customer_name: "Vikram Desai",
        name: "vikram_itr_2024-25.pdf",
        type: "ITR / Tax Return",
        status: "Completed",
        fields: 5,
      },
      {
        id: generateId(),
        customer_id: "R4V1K2",
        customer_name: "Ravi Kumar",
        name: "ravi_aadhaar.pdf",
        type: "Aadhaar Card",
        status: "Pending",
        fields: 0,
      },
    ]);
  }, []);

  /* ==============================
     Derived Stats (Like Backend)
  ============================== */
  const stats = {
    total: documents.length,
    completed: documents.filter((d) => d.status === "Completed").length,
    pending: documents.filter((d) => d.status === "Pending").length,
    failed: 2, // demo constant (same as backend)
  };

  /* ==============================
     Upload Simulation
  ============================== */
  const upload = () => {
    if (!file || !docType) return;

    const newDoc = {
      id: generateId(),
      customer_id: customerId || generateId().substring(0, 6),
      customer_name: customerName || "Unknown Customer",
      name: file.name,
      type: docType,
      status: "Pending",
      fields: 0,
    };

    setDocuments((prev) => [...prev, newDoc]);

    // Simulate async OCR
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === newDoc.id
            ? {
                ...d,
                status: "Completed",
                fields: Math.floor(Math.random() * 6) + 3,
              }
            : d
        )
      );
    }, 2000);

    setFile(null);
    setCustomerId("");
    setCustomerName("");
    setDocType("");
  };

  /* ==============================
     Manual Recalculate
  ============================== */
  const recalcAutomation = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId ? { ...d, status: "Processing" } : d
      )
    );

    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === docId
            ? {
                ...d,
                status: "Completed",
                fields: Math.floor(Math.random() * 6) + 3,
              }
            : d
        )
      );
    }, 1500);
  };

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
            ["Total Documents", stats.total],
            ["OCR Completed", stats.completed],
            ["Pending", stats.pending],
            ["Failed", stats.failed],
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
              placeholder="CUST-123"
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
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.customer_id}</td>
                  <td>{doc.customer_name}</td>
                  <td>{doc.name}</td>
                  <td>{doc.type}</td>
                  <td className={statusClass(doc.status)}>
                    {doc.status}
                  </td>
                  <td>
                    {doc.status === "Completed"
                      ? `${doc.fields} fields`
                      : "—"}
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

          {documents.length === 0 && (
            <div className="empty">No documents uploaded.</div>
          )}
        </div>
      </div>
    </Layout>
  );
}