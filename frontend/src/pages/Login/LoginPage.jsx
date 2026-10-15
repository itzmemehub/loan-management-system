import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import Guilloche from "../../components/ui/Guilloche";
import API from "../../services/api";
import { isLoggedIn, safeNextPath, startSession } from "../../services/auth";
import { isOffline } from "../../services/localStore";

import "./login.css";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const next = safeNextPath(location.state?.from?.pathname || params.get("next"));
  const expired = params.get("expired") === "1";

  if (isLoggedIn()) return <Navigate to={next} replace />;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // The backend sets the HTTP-only session cookie on success.
      await API.post("/auth/login", { email: email.trim(), password });
      startSession();
      navigate(next, { replace: true });
    } catch (err) {
      setError(isOffline(err)
        ? "Can't reach the server. Check your connection and try again."
        : err.response?.data?.message || "That email and password don't match. Check both and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout className="login-page">
      <div className="login-card glass">
        <div className="login-side">
          <Guilloche variant="hero" className="login-art" />
          <h1>Staff sign in</h1>
          <p>Review applications, open uploaded documents and keep records tidy.</p>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          {expired && <p className="login-notice" role="status">Your session ended. Sign in again to continue.</p>}
          <label className="field">Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="username" required /></label>
          <label className="field">Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></label>
          {error && <div className="alert" role="alert">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
          <p className="login-alt">Applying for a loan? <Link to="/apply">You don't need an account</Link></p>
        </form>
      </div>
    </AppLayout>
  );
}

export default LoginPage;
