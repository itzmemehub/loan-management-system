import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Guilloche from "../ui/Guilloche";
import { isLoggedIn } from "../../services/auth";
import { signOut } from "../../services/api";

const icons = {
  home: <><path d="M4 11l8-7 8 7" /><path d="M6 9.5V20h12V9.5" /><path d="M10 20v-6h4v6" /></>,
  emi: <><rect x="5" y="3" width="14" height="18" rx="3" /><path d="M8 7h8" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01" /></>,
  apply: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7" /><path d="M12 17h.01" /></>,
  staff: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>,
  logout: <><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" /><path d="M10 8l-4 4 4 4" /><path d="M6 12h10" /></>,
  list: <><path d="M9 6h11M9 12h11M9 18h11" /><path d="M4 6h.01M4 12h.01M4 18h.01" /></>,
};

const TabIcon = ({ name }) => <span className="tab-icon"><svg viewBox="0 0 24 24" aria-hidden="true">{icons[name]}</svg></span>;

// Mobile tab bar. `match` decides which tab is highlighted for the current URL.
const visitorTabs = [
  { to: "/", label: "Home", icon: "home", match: (l) => l.pathname === "/" && !l.hash },
  { to: "/#emi", label: "EMI", icon: "emi", match: (l) => l.pathname === "/" && l.hash === "#emi" },
  { to: "/apply", label: "Apply", icon: "apply", primary: true, match: (l) => l.pathname.startsWith("/apply") },
  { to: "/#faq", label: "Help", icon: "help", match: (l) => l.pathname === "/" && l.hash === "#faq" },
  { to: "/login", label: "Staff", icon: "staff", match: (l) => l.pathname === "/login" },
];

const adminTabs = [
  visitorTabs[0],
  { to: "/dashboard", label: "Applications", icon: "list", match: (l) => l.pathname === "/dashboard" || l.pathname.startsWith("/loan/") },
  visitorTabs[2],
  visitorTabs[1],
  { label: "Log out", icon: "logout", logout: true },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const signedIn = isLoggedIn();

  const logout = async () => {
    try {
      await signOut();
    } catch {
      // Even if the server can't be reached, the local sign-in hint is cleared.
    }
    navigate("/");
  };

  return (
    <>
      <header className="topbar">
        <nav className="topbar-inner" aria-label="Main">
          <Link to="/" className="logo">
            <span className="logo-mark"><Guilloche variant="mark" /></span>
            <span className="logo-word">LoanFlow</span>
          </Link>

          <div className="topbar-links">
            <Link to="/#loans">Loans</Link>
            <Link to="/#emi">EMI calculator</Link>
            <Link to="/#documents">Documents</Link>
            <Link to="/#faq">Questions</Link>
            {signedIn && <Link to="/dashboard" className={adminTabs[1].match(location) ? "active" : ""}>Applications</Link>}
          </div>

          <div className="topbar-actions">
            {signedIn
              ? <button type="button" className="topbar-quiet" onClick={logout}>Log out</button>
              : <NavLink to="/login" className="topbar-quiet">Staff login</NavLink>}
            <Link to="/apply" className="topbar-cta">Apply now</Link>
          </div>
        </nav>
      </header>

      <nav className="tabbar" aria-label="App">
        {(signedIn ? adminTabs : visitorTabs).map((tab) => {
          if (tab.logout) {
            return (
              <button key={tab.label} type="button" className="tab" onClick={logout}>
                <TabIcon name={tab.icon} />
                <span className="tab-label">{tab.label}</span>
              </button>
            );
          }
          const active = tab.match(location);
          return (
            <Link key={tab.label} to={tab.to} className={`tab ${tab.primary ? "tab-primary" : ""} ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined}>
              <TabIcon name={tab.icon} />
              <span className="tab-label">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default Navbar;
