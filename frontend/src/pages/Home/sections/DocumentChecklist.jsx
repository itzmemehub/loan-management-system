import { useState } from "react";
import { Link } from "react-router-dom";
import { DOCUMENTS } from "../../../config/documents";

function DocumentChecklist({ applyState }) {
  const [ready, setReady] = useState({});
  const readyCount = DOCUMENTS.filter((doc) => ready[doc.key]).length;
  const allReady = readyCount === DOCUMENTS.length;

  const toggle = (key) => setReady((current) => ({ ...current, [key]: !current[key] }));

  return (
    <section className="docs" id="documents">
      <div className="wrap docs-grid">
        <div className="docs-intro">
          <h2>Gather these five files first.</h2>
          <p>The form asks for each one. Tick them off as you find them, so you can finish in one sitting.</p>
          <div className="docs-meter" aria-hidden="true"><span style={{ width: `${(readyCount / DOCUMENTS.length) * 100}%` }} /></div>
          <p className="docs-count" aria-live="polite">
            {allReady
              ? <>All five ready. <Link to="/apply" state={applyState}>Start your application</Link></>
              : `${readyCount} of ${DOCUMENTS.length} ready`}
          </p>
        </div>
        <ul className="docs-list">
          {DOCUMENTS.map((doc) => (
            <li key={doc.key}>
              <label className={`glass ${ready[doc.key] ? "is-ready" : ""}`}>
                <input type="checkbox" checked={Boolean(ready[doc.key])} onChange={() => toggle(doc.key)} />
                <span className="docs-box" aria-hidden="true" />
                <span className="docs-text"><strong>{doc.title}</strong><small>{doc.hint}</small></span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default DocumentChecklist;
