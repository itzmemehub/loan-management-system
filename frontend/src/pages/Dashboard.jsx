import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { deleteLocalApplication, isOffline, listLocalApplications } from "../services/localStore";

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchApplications = async () => {
    const local = listLocalApplications();
    try {
      const res = await API.get("/loans");
      setApplications([...local, ...(res.data.data || [])]);
    } catch (err) {
      console.log(err);
      setApplications(local);
    }
  };

  useEffect(() => { if (localStorage.getItem("login") !== "true") navigate("/login"); else fetchApplications(); }, [navigate]);

  const deleteApplication = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    if (String(id).startsWith("local-")) { deleteLocalApplication(id); fetchApplications(); return; }
    try { await API.delete(`/loans/${id}`); fetchApplications(); }
    catch (err) { if (isOffline(err)) { deleteLocalApplication(id); fetchApplications(); } else alert("Failed to delete application"); }
  };

  const filtered = useMemo(() => applications.filter((loan) => `${loan.fullName} ${loan.phone} ${loan.loanType}`.toLowerCase().includes(search.toLowerCase())), [applications, search]);
  const total = applications.reduce((sum, loan) => sum + Number(loan.loanAmount || 0), 0);

  return <div className="app-shell"><Navbar /><main className="dashboard-page"><div className="page-container"><div className="dashboard-heading"><div><span className="eyebrow dark-eyebrow">MANAGEMENT CONSOLE</span><h1>Loan dashboard</h1><p>Review and manage all submitted applications.</p></div><Link to="/apply" className="btn btn-primary">+ New application</Link></div><div className="stat-grid"><div className="stat-card"><span className="stat-icon blue">↗</span><div><small>Total applications</small><strong>{applications.length}</strong></div></div><div className="stat-card"><span className="stat-icon green">₹</span><div><small>Total requested</small><strong>₹ {total.toLocaleString("en-IN")}</strong></div></div><div className="stat-card"><span className="stat-icon amber">⌁</span><div><small>Records today</small><strong>{applications.filter((x) => new Date(x.createdAt).toDateString() === new Date().toDateString()).length}</strong></div></div></div><div className="table-card"><div className="table-toolbar"><div><h2>Applications</h2><span>{filtered.length} records</span></div><div className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, phone or loan type" /></div></div><div className="table-wrap"><table><thead><tr><th>Applicant</th><th>Loan type</th><th>Amount</th><th>Date</th><th>Actions</th></tr></thead><tbody>{filtered.length ? filtered.map((loan) => <tr key={loan._id}><td><div className="person-cell"><span className="avatar">{loan.fullName?.charAt(0)?.toUpperCase()}</span><span><strong>{loan.fullName}</strong><small>{loan.phone}</small></span></div></td><td>{loan.loanType}</td><td><strong>₹ {Number(loan.loanAmount || 0).toLocaleString("en-IN")}</strong></td><td>{loan.createdAt ? new Date(loan.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</td><td><div className="action-row"><Link to={`/loan/${loan._id}`} className="table-btn view">View</Link><button onClick={() => deleteApplication(loan._id)} className="table-btn delete">Delete</button></div></td></tr>) : <tr><td colSpan="5" className="empty-state">No applications found.</td></tr>}</tbody></table></div></div></div></main></div>;
}

export default Dashboard;
