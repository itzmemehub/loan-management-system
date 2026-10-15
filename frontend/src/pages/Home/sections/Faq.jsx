import { FAQS } from "../content";

function Faq() {
  return (
    <section className="faq" id="faq">
      <div className="wrap faq-grid">
        <h2>Questions people ask before applying.</h2>
        <div className="faq-list">
          {FAQS.map((item) => (
            <details key={item.q} className="glass">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
