const jwt = require("jsonwebtoken");
const { SESSION_COOKIE } = require("../config/session");

// The session normally arrives as the HTTP-only cookie set at login. A Bearer
// header is still accepted for scripts and API clients.
function readToken(req) {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7);
  if (req.query?.token) return req.query.token;
  return req.cookies?.[SESSION_COOKIE] || null;
}

function requireAdmin(req, res, next) {
  const token = readToken(req);
  if (!token) return res.status(401).json({ success: false, message: "Admin authentication required" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "admin") throw new Error("Invalid role");
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired admin session" });
  }
}

module.exports = { requireAdmin };
