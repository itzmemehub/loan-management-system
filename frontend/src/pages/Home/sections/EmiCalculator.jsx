import { Link } from "react-router-dom";
import { LOAN_TYPES } from "../../../config/loans";
import { formatINR, formatINRShort } from "../../../utils/format";

const RING = 2 * Math.PI * 70;
const percent = (value, min, max) => (max === min ? 100 : ((value - min) / (max - min)) * 100);

function EmiCalculator({ calculator }) {
  const { type, typeIndex, chooseType, amount, setAmount, years, setYears, emi, totalPaid, totalInterest, applyState } = calculator;
  const amountStep = type.max > 5000000 ? 100000 : 10000;
  const interestShare = totalPaid > 0 ? totalInterest / totalPaid : 0;

  return (
    <section className="emi" id="emi">
      <div className="wrap emi-grid">
        <div className="emi-intro">
          <h2>Work out your monthly EMI.</h2>
          <p>Move the sliders until the monthly amount fits your budget. When you apply, the loan type and amount come with you.</p>
        </div>

        <div className="calc glass">
          <div className="calc-inputs">
            <div className="calc-types" role="radiogroup" aria-label="Loan type">
              {LOAN_TYPES.map((item, index) => (
                <button key={item.name} type="button" role="radio" aria-checked={index === typeIndex} className={index === typeIndex ? "is-active" : ""} onClick={() => chooseType(index)}>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="calc-field">
              <div className="calc-row">
                <label htmlFor="emi-amount">Loan amount</label>
                <output htmlFor="emi-amount">{formatINR(amount)}</output>
              </div>
              <input id="emi-amount" type="range" min={type.min} max={type.max} step={amountStep} value={amount} onChange={(e) => setAmount(Number(e.target.value))} style={{ "--fill": `${percent(amount, type.min, type.max)}%` }} />
              <div className="calc-scale"><span>{formatINRShort(type.min)}</span><span>{formatINRShort(type.max)}</span></div>
            </div>

            <div className="calc-field">
              <div className="calc-row">
                <label htmlFor="emi-years">Repay over</label>
                <output htmlFor="emi-years">{years} {years === 1 ? "year" : "years"}</output>
              </div>
              <input id="emi-years" type="range" min="1" max={type.maxYears} step="1" value={years} onChange={(e) => setYears(Number(e.target.value))} style={{ "--fill": `${percent(years, 1, type.maxYears)}%` }} />
              <div className="calc-scale"><span>1 year</span><span>{type.maxYears} years</span></div>
            </div>
          </div>

          <div className="calc-result" aria-live="polite">
            <div className="calc-ring">
              <svg viewBox="0 0 160 160" aria-hidden="true">
                <circle cx="80" cy="80" r="70" className="ring-principal" />
                <circle cx="80" cy="80" r="70" className="ring-interest" style={{ strokeDasharray: `${RING * interestShare} ${RING}` }} />
              </svg>
              <div>
                <span>Monthly EMI</span>
                <strong>{formatINR(emi)}</strong>
              </div>
            </div>
            <dl className="calc-split">
              <div><dt><i className="key-principal" />Principal</dt><dd>{formatINR(amount)}</dd></div>
              <div><dt><i className="key-interest" />Total interest</dt><dd>{formatINR(totalInterest)}</dd></div>
              <div><dt>Total you repay</dt><dd>{formatINR(totalPaid)}</dd></div>
            </dl>
            <Link to="/apply" state={applyState} className="btn btn-primary calc-cta">Apply for {formatINR(amount)}</Link>
            <p className="calc-note">At {type.rate}% p.a., the indicative rate for a {type.label.toLowerCase()} loan.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmiCalculator;
