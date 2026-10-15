import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import Guilloche from "../../components/ui/Guilloche";
import { ACCEPTED_FILE_TYPES, DOCUMENTS, DOCUMENT_KEYS } from "../../config/documents";
import { LOAN_TYPE_NAMES, shortLoanName } from "../../config/loans";
import API from "../../services/api";
import { isOffline, saveLocalApplication } from "../../services/localStore";
import { formatINR } from "../../utils/format";
import ApplySuccess from "./ApplySuccess";
import "./apply.css";

const emptyForm = { fullName: "", phone: "", email: "", loanType: "", loanAmount: "" };
const emptyFiles = Object.fromEntries(DOCUMENT_KEYS.map((key) => [key, null]));

// The EMI calculator and loan cards pass { loanType, loanAmount } as router state.
function prefilledForm(state) {
  const loanType = LOAN_TYPE_NAMES.includes(state?.loanType) ? state.loanType : "";
  const loanAmount = Number(state?.loanAmount) > 0 ? String(state.loanAmount) : "";
  return { ...emptyForm, loanType, loanAmount };
}

function ApplyPage() {
  const location = useLocation();
  const [formData, setFormData] = useState(() => prefilledForm(location.state));
  const [files, setFiles] = useState(emptyFiles);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData((current) => ({ ...current, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => setFiles((current) => ({ ...current, [e.target.name]: e.target.files[0] || null }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    Object.entries(files).forEach(([key, file]) => { if (file) data.append(key, file); });
    const summary = { ...formData, documents: Object.values(files).filter(Boolean).length };

    try {
      const res = await API.post("/loans/apply", data);
      setSubmitted({ ...summary, message: res.data.message || "Your application has been submitted." });
    } catch (err) {
      if (isOffline(err)) {
        try {
          await saveLocalApplication(formData, files);
          setSubmitted({ ...summary, message: "Your application has been submitted and saved on this device." });
        } catch {
          setError("Your application couldn't be saved. Check your connection and submit again.");
        }
      } else {
        setError(err.response?.data?.message || "The application couldn't be sent. Check the fields above and submit again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const startAgain = () => {
    setFormData(emptyForm);
    setFiles(emptyFiles);
    setSubmitted(null);
  };

  if (submitted) return <ApplySuccess application={submitted} onStartAgain={startAgain} />;

  const detailsDone = ["fullName", "phone", "email"].every((key) => formData[key].trim());
  const loanDone = Boolean(formData.loanType) && Number(formData.loanAmount) > 0;
  const docsCount = Object.values(files).filter(Boolean).length;

  return (
    <AppLayout className="apply-page" withFooter>
      <div className="wrap apply-grid">
        <aside className="apply-aside glass">
          <Guilloche variant="card" className="apply-aside-art" />
          <h1>Apply for a loan</h1>
          <p>Three short sections. Your progress shows here as you go.</p>
          <ol className="apply-progress">
            <li className={detailsDone ? "is-done" : ""}><strong>Your details</strong><span>{detailsDone ? formData.fullName : "Name, phone and email"}</span></li>
            <li className={loanDone ? "is-done" : ""}><strong>The loan</strong><span>{loanDone ? `${formData.loanType}, ${formatINR(formData.loanAmount)}` : "Type and amount"}</span></li>
            <li className={docsCount === DOCUMENTS.length ? "is-done" : ""}><strong>Documents</strong><span>{docsCount} of {DOCUMENTS.length} attached</span></li>
          </ol>
          <p className="apply-aside-note">Need to work out your EMI first? <Link to="/#emi">Use the calculator</Link></p>
        </aside>

        <form onSubmit={handleSubmit} className="apply-form">
          <fieldset className="glass">
            <legend>Your details</legend>
            <div className="field-grid">
              <label className="field field-full">Full name<input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="As on your PAN card" autoComplete="name" required /></label>
              <label className="field">Phone number<input name="phone" type="tel" inputMode="numeric" pattern="[0-9]{10}" title="10-digit mobile number" value={formData.phone} onChange={handleChange} placeholder="10-digit mobile number" autoComplete="tel" required /></label>
              <label className="field">Email address<input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" autoComplete="email" required /></label>
            </div>
          </fieldset>

          <fieldset className="glass">
            <legend>The loan</legend>
            <div className="type-picker" role="radiogroup" aria-label="Loan type">
              {LOAN_TYPE_NAMES.map((option) => (
                <label key={option} className={formData.loanType === option ? "is-active" : ""}>
                  <input type="radio" name="loanType" value={option} checked={formData.loanType === option} onChange={handleChange} required />
                  {shortLoanName(option)}
                </label>
              ))}
            </div>
            <label className="field field-amount">Loan amount
              <span className="amount-input"><span aria-hidden="true">₹</span><input type="number" min="1" name="loanAmount" value={formData.loanAmount} onChange={handleChange} placeholder="300000" required /></span>
              <small>{Number(formData.loanAmount) > 0 ? `${formatINR(formData.loanAmount)} requested` : "Enter the amount in rupees"}</small>
            </label>
          </fieldset>

          <fieldset className="glass">
            <legend>Documents</legend>
            <p className="fieldset-hint">PDF, JPG or PNG. Make sure every page is readable.</p>
            <div className="upload-list">
              {DOCUMENTS.map((doc) => (
                <label className={`upload ${files[doc.key] ? "is-attached" : ""}`} key={doc.key}>
                  <span className="file-icon" aria-hidden="true" />
                  <span className="file-text"><strong>{doc.title}</strong><small>{files[doc.key]?.name || doc.hint}</small></span>
                  <span className="upload-action">{files[doc.key] ? "Replace" : "Choose file"}</span>
                  <input type="file" name={doc.key} onChange={handleFileChange} accept={ACCEPTED_FILE_TYPES} />
                </label>
              ))}
            </div>
          </fieldset>

          {error && <div className="alert" role="alert">{error}</div>}
          <div className="apply-submit">
            <p>By submitting, you confirm the information above is accurate.</p>
            <button className="btn btn-primary" disabled={submitting}>{submitting ? "Submitting…" : "Submit application"}</button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

export default ApplyPage;
