import { Link } from "react-router-dom";
import Guilloche from "../../../components/ui/Guilloche";
import { DOCUMENTS } from "../../../config/documents";
import { monthlyEmi } from "../../../utils/emi";
import { formatINR } from "../../../utils/format";
import { SAMPLE_SLIP } from "../content";

function Hero() {
  const sampleEmi = monthlyEmi(SAMPLE_SLIP.amount, SAMPLE_SLIP.rate, SAMPLE_SLIP.years * 12);

  return (
    <section className="hero">
      <Guilloche variant="hero" className="hero-art" animate />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1>A loan application that takes ten minutes, not ten branch visits.</h1>
          <p>Personal, business, education and home loans. See your EMI, upload five documents, and send it all from your phone.</p>
          <div className="hero-actions">
            <Link to="/apply" className="btn btn-primary">Start your application</Link>
            <Link to="/#emi" className="btn btn-glass">Calculate your EMI</Link>
          </div>
          <ul className="hero-points">
            <li>No paperwork to print</li>
            <li>Upload PDF, JPG or PNG</li>
            <li>Prefilled from the calculator</li>
          </ul>
        </div>

        {/* Decorative example of a finished application */}
        <div className="hero-visual" aria-hidden="true">
          <div className="slip glass">
            <Guilloche variant="card" className="slip-art" />
            <div className="slip-head">
              <span className="logo-word">LoanFlow</span>
              <span>Application summary</span>
            </div>
            <div className="slip-amount">
              <span>{SAMPLE_SLIP.loanType}</span>
              <strong>{formatINR(SAMPLE_SLIP.amount)}</strong>
            </div>
            <div className="slip-rows">
              <div><span>Tenure</span><strong>{SAMPLE_SLIP.years} years</strong></div>
              <div><span>Estimated EMI</span><strong>{formatINR(sampleEmi)}</strong></div>
              <div><span>Indicative rate</span><strong>{SAMPLE_SLIP.rate}% p.a.</strong></div>
            </div>
            <ul className="slip-docs">
              {DOCUMENTS.map((doc) => <li key={doc.key}>{doc.title}</li>)}
            </ul>
            <div className="slip-stamp">Documents<br />received</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
