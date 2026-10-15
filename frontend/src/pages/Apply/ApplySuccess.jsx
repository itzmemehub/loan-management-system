import { useEffect } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { DOCUMENTS } from "../../config/documents";
import { formatINR } from "../../utils/format";

function ApplySuccess({ application, onStartAgain }) {
  // The submit button sits at the bottom of a long form; start the
  // confirmation at the top so the heading is the first thing seen.
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  return (
    <AppLayout className="done-page" withFooter>
      <div className="done-card glass">
        <span className="done-tick" aria-hidden="true" />
        <h1>Application sent</h1>
        <p>{application.message}</p>
        <dl className="done-summary">
          <div><dt>Applicant</dt><dd>{application.fullName}</dd></div>
          <div><dt>Loan</dt><dd>{application.loanType}</dd></div>
          <div><dt>Amount</dt><dd>{formatINR(application.loanAmount)}</dd></div>
          <div><dt>Documents</dt><dd>{application.documents} of {DOCUMENTS.length} attached</dd></div>
        </dl>
        <p className="done-next">The loan team will contact you on {application.phone} or {application.email} once your documents have been reviewed.</p>
        <div className="done-actions">
          <Link to="/" className="btn btn-primary">Back to home</Link>
          <button type="button" className="btn btn-glass" onClick={onStartAgain}>Start another application</button>
        </div>
      </div>
    </AppLayout>
  );
}

export default ApplySuccess;
