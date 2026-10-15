// The admin session itself is an HTTP-only cookie set by the backend; page
// scripts can't read it. This file only keeps a "signed in" hint so the UI
// can show the right links and guard routes before the first API call. The
// backend is the real authority: any 401 clears the hint (see api.js).
const SIGNED_IN_KEY = "lf_admin";

// Older builds kept the JWT itself in localStorage. Remove it.
try {
  localStorage.removeItem("token");
  localStorage.removeItem("login");
} catch {
  // Storage can be unavailable (private mode); nothing to clean up then.
}

export function isLoggedIn() {
  try {
    return localStorage.getItem(SIGNED_IN_KEY) === "1";
  } catch {
    return false;
  }
}

export function startSession() {
  try { localStorage.setItem(SIGNED_IN_KEY, "1"); } catch { /* UI hint only */ }
}

export function endSession() {
  try { localStorage.removeItem(SIGNED_IN_KEY); } catch { /* UI hint only */ }
}

// Only allow redirects to paths inside this app.
export const safeNextPath = (path) => (typeof path === "string" && path.startsWith("/") && !path.startsWith("//") ? path : "/dashboard");
