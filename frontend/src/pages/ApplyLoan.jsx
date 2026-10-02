import { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { isOffline, saveLocalApplication } from "../services/localStore";

const initialForm = { fullName: "", phone: "", email: "", loanType: "", loanAmount: "" };
const initialFiles = { aadhaar: null, pan: null, salarySlip: null, bankStatement: null, photo: null };

function ApplyLoan() {
  const [formData, setFormData] = useState(initialForm);
  const [files, setFiles] = useState(initialFiles);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData((current) => ({ ...current, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => setFiles((current) => ({ ...current, [e.target.name]: e.target.files[0] || null }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true); setSuccess(""); setError("");
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    Object.entries(files).forEach(([key, value]) => { if (value) data.append(key, value); });
    const form = e.target;
    try {
      const res = await API.post("/loans/apply", data);
      setSuccess(res.data.message || "Your application has been submitted successfully.");
      setFormData(initialForm); setFiles(initialFiles); form.reset();
    } catch (err) {
      if (isOffline(err)) {
        try {
          await saveLocalApplication(formData, files);
          setSuccess("Your application has been submitted successfully and saved on this device.");
          setFormData(initialForm); setFiles(initialFiles); form.reset();
        } catch { setError("We could not save your application. Please try again."); }
      } else {
        setError(err.response?.data?.message || "Something went wrong. Please try again.");
      }
    }
    finally { setSubmitting(false); }
  };

  const documents = [["aadhaar", "Aadhaar Card", "Identity proof"], ["pan", "PAN Card", "Tax identification"], ["salarySlip", "Salary Slip", "Income proof"], ["bankStatement", "Bank Statement", "Recent statement"], ["photo", "Photograph", "Recent photo"]];

  return <div className="app-shell"><Navbar /><main className="form-page"><div className="page-container"><div className="form-header"><div><span className="eyebrow dark-eyebrow">NEW APPLICATION</span><h1>Apply for a loan</h1><p>Enter your details and attach the documents needed for review.</p></div><div className="step-indicator"><span>01</span><small>Application</small></div></div><form onSubmit={handleSubmit} className="application-card"><section className="form-section"><div className="section-title"><span>01</span><div><h2>Personal & loan details</h2><p>Tell us a little about the applicant and requested loan.</p></div></div><div className="form-grid"><label>Full name<input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter full name" required /></label><label>Phone number<input name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit phone number" required /></label><label>Email address<input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" required /></label><label>Loan type<select name="loanType" value={formData.loanType} onChange={handleChange} required><option value="">Select loan type</option><option>Personal Loan</option><option>Business Loan</option><option>Education Loan</option><option>Home Loan</option><option>Other</option></select></label><label className="full-span">Loan amount (₹)<input type="number" min="1" name="loanAmount" value={formData.loanAmount} onChange={handleChange} placeholder="e.g. 100000" required /></label></div></section><section className="form-section"><div className="section-title"><span>02</span><div><h2>Supporting documents</h2><p>PDF, JPG or PNG files are recommended.</p></div></div><div className="document-grid">{documents.map(([name, title, hint]) => <label className="file-card" key={name}><span className="file-icon">↑</span><span><strong>{title}</strong><small>{files[name]?.name || hint}</small></span><input type="file" name={name} onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" /></label>)}</div></section>{success && <div className="form-success">✓ {success}</div>}{error && <div className="form-error">{error}</div>}<div className="form-footer"><span>By submitting, you confirm the information provided is accurate.</span><button className="btn btn-primary btn-large" disabled={submitting}>{submitting ? "Submitting..." : "Submit application →"}</button></div></form></div></main></div>;
}

export default ApplyLoan;
