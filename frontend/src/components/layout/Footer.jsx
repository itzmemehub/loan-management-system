import { Link } from "react-router-dom";
import Guilloche from "../ui/Guilloche";
import { LOAN_TYPES } from "../../config/loans";

function Footer() {
  return (
    <footer className="site-foot">
      <Guilloche variant="hero" className="site-foot-art" />
      <div className="wrap site-foot-inner">
        <div className="site-foot-brand">
          <Link to="/" className="logo">
            <span className="logo-mark"><Guilloche variant="mark" /></span>
            <span className="logo-word">LoanFlow</span>
          </Link>
          <p>Apply for personal, business, education and home loans online. One form, five documents, no branch visit to get started.</p>
          <Link to="/apply" className="topbar-cta">Start your application</Link>
        </div>

        <div className="site-foot-col">
          <h2>Loans</h2>
          {LOAN_TYPES.map((loan) => <Link key={loan.name} to="/apply" state={{ loanType: loan.name }}>{loan.name}</Link>)}
        </div>
        <div className="site-foot-col">
          <h2>Before you apply</h2>
          <Link to="/#emi">EMI calculator</Link>
          <Link to="/#documents">Document checklist</Link>
          <Link to="/#process">How it works</Link>
          <Link to="/#faq">Questions</Link>
        </div>
        <div className="site-foot-col">
          <h2>For staff</h2>
          <Link to="/login">Staff login</Link>
          <Link to="/dashboard">Applications dashboard</Link>
        </div>
      </div>
      <div className="wrap site-foot-base">
        <span>© {new Date().getFullYear()} LoanFlow</span>
        <span>EMI figures on this site are estimates. Final terms are confirmed after review.</span>
      </div>
    </footer>
  );
}

export default Footer;
