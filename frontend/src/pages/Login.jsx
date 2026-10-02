import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { isOffline } from "../services/localStore";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email: email.trim(), password });
      localStorage.setItem("login", "true");
      localStorage.setItem("token", res.data.token);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      if (isOffline(err) && email.trim().toLowerCase() === "admin@example.com" && password === "admin123") {
        localStorage.setItem("login", "true");
        localStorage.setItem("token", "offline-admin");
        navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
        return;
      }
      setError(isOffline(err) ? "Cannot reach the server. Use admin@example.com / admin123 for offline access." : err.response?.data?.message || "Incorrect email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return <div className="auth-shell"><Navbar /><main className="auth-page"><div className="auth-card"><div className="auth-badge">LM</div><span className="eyebrow dark-eyebrow">ADMIN ACCESS</span><h1>Welcome back</h1><p>Sign in to manage your loan applications.</p><form onSubmit={handleLogin} className="auth-form"><label>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required /></label><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required /></label>{error && <div className="form-error">{error}</div>}<button className="btn btn-primary btn-large" type="submit" disabled={loading}>{loading ? "Signing in..." : <>Sign in <span>→</span></>}</button></form><Link to="/" className="back-link">← Back to home</Link></div></main></div>;
}

export default Login;
