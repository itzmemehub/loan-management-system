import { Link } from "react-router-dom";
import { LOAN_TYPES } from "../../../config/loans";
import { formatINRShort } from "../../../utils/format";

const iconShapes = {
  wallet: <><rect x="6" y="12" width="36" height="26" rx="5" /><path d="M10 12l20-6 4 6" /><path d="M42 22h-9a3 3 0 0 0 0 6h9" /></>,
  shop: <><path d="M8 18l3-10h26l3 10" /><path d="M8 18a5 5 0 0 0 10 0a5 5 0 0 0 12 0a5 5 0 0 0 10 0" /><path d="M11 23v17h26V23" /><path d="M20 40v-9h8v9" /></>,
  cap: <><path d="M4 18l20-9 20 9-20 9z" /><path d="M12 22v9c3 4 9 5 12 5s9-1 12-5v-9" /><path d="M44 18v12" /></>,
  home: <><path d="M6 22L24 8l18 14" /><path d="M11 18v22h26V18" /><path d="M20 40V28h8v12" /></>,
};

function LoanProducts({ onCheckEmi }) {
  return (
    <section className="loans" id="loans">
      <div className="wrap">
        <div className="section-head">
          <h2>Choose the loan that fits what you're paying for.</h2>
          <p>Rates shown are where each loan type starts. Your final rate is confirmed after review.</p>
        </div>
        <div className="loan-grid">
          {LOAN_TYPES.map((loan, index) => (
            <article key={loan.name} className={`loan loan-${loan.tone} glass`}>
              <svg viewBox="0 0 48 48" className="loan-icon" aria-hidden="true">{iconShapes[loan.icon]}</svg>
              <h3>{loan.name}</h3>
              <p>{loan.purpose}</p>
              <dl>
                <div><dt>From</dt><dd>{loan.rate}% p.a.</dd></div>
                <div><dt>Up to</dt><dd>{formatINRShort(loan.max)}</dd></div>
                <div><dt>Tenure</dt><dd>{loan.maxYears} years</dd></div>
              </dl>
              <div className="loan-actions">
                <Link to="/apply" state={{ loanType: loan.name }} className="loan-apply">Apply for a {loan.label.toLowerCase()} loan</Link>
                <button type="button" className="loan-check" onClick={() => onCheckEmi(index)}>Check EMI</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LoanProducts;
