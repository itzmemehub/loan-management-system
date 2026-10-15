import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { DOCUMENTS, DOCUMENT_KEYS, countAttached } from "../../config/documents";
import { LOAN_TYPE_NAMES, loanTone, shortLoanName } from "../../config/loans";
import API from "../../services/api";
import { deleteLocalApplication, isOffline, listLocalApplications } from "../../services/localStore";
import { formatDate, formatINR, isToday } from "../../utils/format";
import "./dashboard.css";

const FILTERS = ["All", ...LOAN_TYPE_NAMES];

// Server applications plus any saved in this browser while offline.
// A 401 is handled by the API client (back to sign in).
async function loadApplications() {
  const local = listLocalApplications();
  try {
    const res = await API.get("/loans");
    return { items: [...local, ...(res.data.data || [])], notice: "" };
  } catch (err) {
    return {
      items: local,
      notice: isOffline(err)
        ? "Can't reach the server. Showing only applications saved on this device."
        : err.response?.data?.message || "Applications couldn't be loaded from the server. Refresh to try again.",
    };
  }
}

function DashboardPage() {
  const [state, setState] = useState({ items: null, notice: "" });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const refresh = useCallback(() => loadApplications().then(setState), []);

  useEffect(() => {
    let active = true;
    loadApplications().then((result) => { if (active) setState(result); });
    return () => { active = false; };
  }, []);

  const deleteApplication = async (loan) => {
    if (!window.confirm(`Delete the application from ${loan.fullName}? This can't be undone.`)) return;
    const id = String(loan._id);
    if (id.startsWith("local-")) { deleteLocalApplication(id); refresh(); return; }
    try {
      await API.delete(`/loans/${id}`);
      refresh();
    } catch (err) {
      if (isOffline(err)) setState((current) => ({ ...current, notice: "Can't reach the server, so the application wasn't deleted. Try again when you're back online." }));
      else if (err.response?.status !== 401) setState((current) => ({ ...current, notice: "The application couldn't be deleted. Try again." }));
    }
  };

  const list = useMemo(() => state.items || [], [state.items]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return list.filter((loan) =>
      (filter === "All" || loan.loanType === filter) &&
      `${loan.fullName} ${loan.phone} ${loan.email} ${loan.loanType}`.toLowerCase().includes(query));
  }, [list, search, filter]);

  const totalRequested = list.reduce((sum, loan) => sum + Number(loan.loanAmount || 0), 0);
  const receivedToday = list.filter((loan) => isToday(loan.createdAt)).length;
  const missingDocs = list.filter((loan) => countAttached(loan) < DOCUMENTS.length).length;
  const loading = state.items === null;

  return (
    <AppLayout className="dashboard-page">
      <div className="wrap">
        <div className="dash-head">
          <div>
            <h1>Applications</h1>
            <p>Every loan application submitted through the site.</p>
          </div>
          <Link to="/apply" className="btn btn-primary">New application</Link>
        </div>

        <dl className="dash-stats glass">
          <div><dt>Applications</dt><dd>{list.length}</dd></div>
          <div className="is-money"><dt>Total requested</dt><dd>{formatINR(totalRequested)}</dd></div>
          <div><dt>Received today</dt><dd>{receivedToday}</dd></div>
          <div className="is-warning"><dt>Missing documents</dt><dd>{missingDocs}</dd></div>
        </dl>

        <div className="dash-panel glass">
          <div className="dash-tools">
            <label className="dash-search">
              <span className="sr-only">Search applications</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, phone or email" />
            </label>
            <div className="dash-filters" role="group" aria-label="Filter by loan type">
              {FILTERS.map((item) => (
                <button key={item} type="button" aria-pressed={filter === item} className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)}>
                  {shortLoanName(item)}
                </button>
              ))}
            </div>
          </div>

          {state.notice && <div className="alert dash-error" role="status">{state.notice}</div>}

          {loading ? (
            <div className="dash-empty"><span className="spinner" />Loading applications…</div>
          ) : !list.length ? (
            <div className="dash-empty">
              <strong>No applications yet</strong>
              <p>Applications appear here as soon as someone submits the form.</p>
              <Link to="/apply" className="btn btn-primary">Add the first one</Link>
            </div>
          ) : !filtered.length ? (
            <div className="dash-empty">
              <strong>No applications match</strong>
              <p>Try a different name or number, or clear the loan type filter.</p>
              <button type="button" className="btn btn-glass" onClick={() => { setSearch(""); setFilter("All"); }}>Clear search and filter</button>
            </div>
          ) : (
            <table className="dash-table">
              <thead><tr><th>Applicant</th><th>Loan</th><th>Amount</th><th>Documents</th><th>Received</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {filtered.map((loan) => {
                  const attached = countAttached(loan);
                  return (
                    <tr key={loan._id}>
                      <td data-label="Applicant">
                        <div className="person">
                          <span className="avatar" aria-hidden="true">{loan.fullName?.charAt(0)?.toUpperCase() || "?"}</span>
                          <span><Link to={`/loan/${loan._id}`}>{loan.fullName || "Unnamed applicant"}</Link><small>{loan.phone}</small></span>
                        </div>
                      </td>
                      <td data-label="Loan"><span className={`type-pill tone-${loanTone(loan.loanType)}`}>{loan.loanType || "Not set"}</span></td>
                      <td data-label="Amount" className="num">{formatINR(loan.loanAmount)}</td>
                      <td data-label="Documents">
                        <span className={`doc-count ${attached === DOCUMENTS.length ? "is-full" : ""}`}>
                          <span className="doc-dots" aria-hidden="true">{DOCUMENT_KEYS.map((key) => <i key={key} className={loan[key] ? "on" : ""} />)}</span>
                          {attached} of {DOCUMENTS.length}
                        </span>
                      </td>
                      <td data-label="Received">{formatDate(loan.createdAt)}</td>
                      <td className="row-actions">
                        <Link to={`/loan/${loan._id}`} className="chip">Open</Link>
                        <button type="button" className="chip chip-danger" onClick={() => deleteApplication(loan)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        {!loading && list.length > 0 && <p className="dash-foot">Showing {filtered.length} of {list.length} applications</p>}
      </div>
    </AppLayout>
  );
}

export default DashboardPage;
