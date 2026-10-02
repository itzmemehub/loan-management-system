import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { getLocalApplication } from "../services/localStore";

function LoanDetails() {
  const { id } = useParams(); const [loan, setLoan] = useState(null); const [error, setError] = useState("");
  useEffect(() => {
    const local = getLocalApplication(id);
    if (local) { setLoan(local); return; }
    API.get(`/loans/${id}`).then((res) => setLoan(res.data.data)).catch(() => setError("Unable to load this application.")); }, [id]);
  if (error) return <><Navbar /><div className="center-message">{error}<Link to="/dashboard" className="back-link">← Back to dashboard</Link></div></>;
  if (!loan) return <><Navbar /><div className="center-message"><div className="spinner" />Loading application...</div></>;
  const docs = [["Aadhaar Card", loan.aadhaar], ["PAN Card", loan.pan], ["Salary Slip", loan.salarySlip], ["Bank Statement", loan.bankStatement], ["Photograph", loan.photo]];
  return <div className="app-shell"><Navbar /><main className="details-page"><div className="page-container"><Link to="/dashboard" className="back-link">← Back to dashboard</Link><div className="details-heading"><div><span className="eyebrow dark-eyebrow">APPLICATION RECORD</span><h1>{loan.fullName}</h1><p>{loan.email} · {loan.phone}</p></div><span className="status-badge">Pending review</span></div><div className="details-grid"><section className="details-card"><h2>Loan information</h2><div className="detail-list"><div><span>Applicant</span><strong>{loan.fullName}</strong></div><div><span>Phone</span><strong>{loan.phone}</strong></div><div><span>Email</span><strong>{loan.email}</strong></div><div><span>Loan type</span><strong>{loan.loanType}</strong></div><div><span>Requested amount</span><strong className="amount">₹ {Number(loan.loanAmount || 0).toLocaleString("en-IN")}</strong></div></div></section><section className="details-card"><h2>Uploaded documents</h2><div className="doc-list">{docs.map(([name, value]) => <div className="doc-row" key={name}><span className="file-icon">✓</span><div><strong>{name}</strong><small>{value ? value.split(/[\\/]/).pop() : "Not uploaded"}</small></div>{value && (value.startsWith("data:") || value.includes("/")) && <a href={value.startsWith("http") || value.startsWith("data:") ? value : `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")}/${value.replace(/^[/\\]+/, "")}`} target="_blank" rel="noreferrer" className="table-btn view">View</a>}</div>)}</div></section></div></div></main></div>;
}

export default LoanDetails;
