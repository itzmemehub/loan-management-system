import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import Guilloche from "../../components/ui/Guilloche";
import { DOCUMENTS, countAttached } from "../../config/documents";
import { loanTone } from "../../config/loans";
import API, { fileUrl } from "../../services/api";
import { getLocalApplication, isOffline } from "../../services/localStore";
import { formatDateTime, formatINR } from "../../utils/format";
import "./loan-details.css";

// Offline records keep small files inline as data: URLs and large ones as a bare file name.
const canOpen = (value) => Boolean(value) && (value.startsWith("data:") || value.includes("/"));
const fileName = (value) => (value.startsWith("data:") ? "Stored on this device" : value.split(/[\\/]/).pop());

function LoanDetailsPage() {
  const { id } = useParams();
  const local = getLocalApplication(id);
  const [remote, setRemote] = useState({ id: null, loan: null, error: "" });

  useEffect(() => {
    if (getLocalApplication(id)) return undefined;
    let active = true;
    API.get(`/loans/${id}`)
      .then((res) => { if (active) setRemote({ id, loan: res.data.data, error: "" }); })
      .catch((err) => {
        if (!active || err.response?.status === 401) return;
        const error = isOffline(err)
          ? "The server isn't reachable right now. Try again when you're back online."
          : "This application couldn't be found. It may have been deleted.";
        setRemote({ id, loan: null, error });
      });
    return () => { active = false; };
  }, [id]);

  const loan = local || (remote.id === id ? remote.loan : null);
  const error = !local && remote.id === id ? remote.error : "";

  if (!loan) {
    return (
      <AppLayout className="center-state">
        {error
          ? <><strong>Application not available</strong><p>{error}</p><Link to="/dashboard" className="btn btn-primary">Back to applications</Link></>
          : <><span className="spinner" />Loading application…</>}
      </AppLayout>
    );
  }

  const attached = countAttached(loan);
  const missing = DOCUMENTS.length - attached;

  return (
    <AppLayout className="details-page">
      <div className="wrap">
        <Link to="/dashboard" className="back-link">Back to applications</Link>

        <div className="detail-head">
          <span className="avatar avatar-lg" aria-hidden="true">{loan.fullName?.charAt(0)?.toUpperCase() || "?"}</span>
          <div>
            <h1>{loan.fullName || "Unnamed applicant"}</h1>
            <p>
              {loan.phone && <a href={`tel:${loan.phone}`}>{loan.phone}</a>}
              {loan.email && <a href={`mailto:${loan.email}`}>{loan.email}</a>}
            </p>
          </div>
        </div>

        <div className="detail-grid">
          <section className="detail-loan glass">
            <Guilloche variant="card" className="detail-art" />
            <span className={`type-pill tone-${loanTone(loan.loanType)}`}>{loan.loanType || "Loan type not set"}</span>
            <p className="detail-amount">{formatINR(loan.loanAmount)}</p>
            <p className="detail-amount-label">Requested amount</p>
            <dl>
              <div><dt>Received</dt><dd>{formatDateTime(loan.createdAt)}</dd></div>
              <div><dt>Reference</dt><dd className="detail-ref">{String(loan._id)}</dd></div>
              <div><dt>Documents</dt><dd>{attached} of {DOCUMENTS.length} attached</dd></div>
            </dl>
          </section>

          <section className="detail-docs glass">
            <h2>Documents</h2>
            {missing > 0 && <p className="detail-warn">{missing} {missing === 1 ? "document is" : "documents are"} missing. Contact the applicant before reviewing.</p>}
            <ul>
              {DOCUMENTS.map((doc) => {
                const value = loan[doc.key];
                return (
                  <li key={doc.key} className={value ? "" : "is-missing"}>
                    <span className="file-icon" aria-hidden="true" />
                    <span className="file-text"><strong>{doc.title}</strong><small title={value ? fileName(value) : undefined}>{value ? fileName(value) : "Not uploaded"}</small></span>
                    {canOpen(value) && <a href={fileUrl(value)} target="_blank" rel="noreferrer" className="chip">Open file</a>}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}

export default LoanDetailsPage;
