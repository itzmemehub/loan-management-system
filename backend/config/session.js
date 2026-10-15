// Admin session cookie settings, shared by the auth routes and middleware.
//
// The JWT lives in an HTTP-only cookie, so page scripts can never read it.
// COOKIE_SAMESITE:
//   lax  (default) - frontend and API on the same site, e.g. a Netlify proxy
//                    for /api, or localhost:5173 -> localhost:5000.
//   none           - frontend and API on different sites. Requires HTTPS, and
//                    Safari blocks these cookies, so prefer the proxy.

const SESSION_COOKIE = "lf_session";
const SESSION_HOURS = 8;

const isProduction = process.env.NODE_ENV === "production";
const sameSite = (process.env.COOKIE_SAMESITE || "lax").toLowerCase();

const cookieOptions = {
  httpOnly: true,
  sameSite,
  secure: sameSite === "none" || isProduction,
  path: "/",
};

module.exports = {
  SESSION_COOKIE,
  SESSION_HOURS,
  setSessionCookie: (res, token) => res.cookie(SESSION_COOKIE, token, { ...cookieOptions, maxAge: SESSION_HOURS * 60 * 60 * 1000 }),
  clearSessionCookie: (res) => res.clearCookie(SESSION_COOKIE, cookieOptions),
};
