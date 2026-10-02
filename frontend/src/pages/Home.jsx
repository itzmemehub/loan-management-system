import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const features = [
  { icon: "01", title: "Simple application", text: "Submit your basic details and loan request through a clean, guided form." },
  { icon: "02", title: "Secure documents", text: "Attach identity and financial documents to keep every application organized." },
  { icon: "03", title: "Easy tracking", text: "Use the dashboard to search applications and open complete loan records." },
];

function Home() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <section className="hero-section">
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />
          <div className="hero-content page-container">
            <div className="hero-copy">
              <span className="eyebrow">MODERN LOAN MANAGEMENT</span>
              <h1>Loans made <span>simple.</span><br />Management made clear.</h1>
              <p>Collect applications, organize documents and manage every loan record from one polished workspace.</p>
              <div className="hero-actions">
                <Link to="/apply" className="btn btn-primary btn-large">Start an application <span>→</span></Link>
                <Link to="/dashboard" className="btn btn-ghost btn-large">Open dashboard</Link>
              </div>
              <div className="hero-trust">
                <span className="trust-dot" /> Secure document uploads
                <span className="trust-separator" />
                <span className="trust-dot" /> Organized records
              </div>
            </div>
            <div className="hero-card-wrap">
              <div className="hero-card">
                <div className="hero-card-top">
                  <span>Application overview</span><span className="status-pill">LIVE</span>
                </div>
                <div className="hero-amount">₹ 2,50,000</div>
                <div className="hero-muted">Requested loan amount</div>
                <div className="mini-chart"><span style={{ height: "34%" }} /><span style={{ height: "48%" }} /><span style={{ height: "42%" }} /><span style={{ height: "66%" }} /><span style={{ height: "58%" }} /><span style={{ height: "84%" }} /><span style={{ height: "72%" }} /></div>
                <div className="hero-card-footer"><span>Application status</span><strong>Pending review</strong></div>
              </div>
              <div className="floating-card floating-card-one"><span className="floating-icon">✓</span><span><strong>Documents</strong><small>All records attached</small></span></div>
              <div className="floating-card floating-card-two"><span className="floating-icon">₹</span><span><strong>Loan tracking</strong><small>Easy to manage</small></span></div>
            </div>
          </div>
        </section>

        <section className="section light-section">
          <div className="page-container">
            <div className="section-heading"><span className="eyebrow dark-eyebrow">BUILT FOR CLARITY</span><h2>Everything you need to manage applications.</h2><p>A focused experience for applicants and the people managing their records.</p></div>
            <div className="feature-grid">
              {features.map((feature) => <article className="feature-card" key={feature.icon}><span className="feature-number">{feature.icon}</span><h3>{feature.title}</h3><p>{feature.text}</p><span className="feature-arrow">↗</span></article>)}
            </div>
          </div>
        </section>

        <section className="section cta-section">
          <div className="page-container cta-box"><div><span className="eyebrow">READY WHEN YOU ARE</span><h2>Start your next loan application.</h2></div><Link to="/apply" className="btn btn-light btn-large">Apply for a loan →</Link></div>
        </section>
      </main>
      <footer className="site-footer"><div className="page-container footer-inner"><div className="brand footer-brand"><span className="brand-mark">LM</span><span><strong>Loan<span>Flow</span></strong><small>Loan Management</small></span></div><span>© 2026 LoanFlow. Built for simple, organized lending.</span></div></footer>
    </div>
  );
}

export default Home;
