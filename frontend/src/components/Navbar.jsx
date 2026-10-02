import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("login") === "true";

  const linkClass = (path) =>
    `nav-link ${location.pathname === path ? "nav-link-active" : ""}`;

  const logout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="site-header">
      <nav className="nav-shell">
        <Link to="/" className="brand">
          <span className="brand-mark">LM</span>
          <span>
            <strong>Loan<span>Flow</span></strong>
            <small>Loan Management</small>
          </span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={linkClass("/")}>Home</Link>
          <Link to="/apply" className={linkClass("/apply")}>Apply Loan</Link>
          {isLoggedIn && <Link to="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>}
        </div>

        <div className="nav-actions">
          {isLoggedIn ? (
            <button className="btn btn-outline nav-login" onClick={logout}>Logout</button>
          ) : (
            <Link to="/login" className="btn btn-primary nav-login">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
