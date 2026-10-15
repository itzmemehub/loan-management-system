import { PROCESS_STEPS } from "../content";

function ProcessSteps() {
  return (
    <section className="process" id="process">
      <div className="wrap">
        <div className="section-head">
          <h2>From form to decision.</h2>
          <p>Here's what happens after you press submit.</p>
        </div>
        <ol className="process-list">
          {PROCESS_STEPS.map((step, index) => (
            <li key={step.title} className="glass">
              <span className="process-num" aria-hidden="true">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default ProcessSteps;
