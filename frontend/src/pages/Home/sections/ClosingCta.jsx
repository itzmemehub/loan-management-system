import { Link } from "react-router-dom";

function ClosingCta({ applyState }) {
  return (
    <section className="closer">
      <div className="wrap closer-inner glass">
        <h2>Ready with your documents?</h2>
        <Link to="/apply" state={applyState} className="btn btn-primary">Start your application</Link>
      </div>
    </section>
  );
}

export default ClosingCta;
