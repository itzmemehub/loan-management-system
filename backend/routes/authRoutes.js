const express = require("express");
const jwt = require("jsonwebtoken");
const { requireAdmin } = require("../middleware/authMiddleware");
const { SESSION_HOURS, setSessionCookie, clearSessionCookie } = require("../config/session");

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword || !process.env.JWT_SECRET) {
    return res.status(500).json({ success: false, message: "Admin authentication is not configured on the server." });
  }

  if (String(email).trim().toLowerCase() !== String(adminEmail).trim().toLowerCase() || password !== adminPassword) {
    return res.status(401).json({ success: false, message: "Incorrect email or password. Please try again." });
  }

  const token = jwt.sign({ role: "admin", email: adminEmail }, process.env.JWT_SECRET, { expiresIn: `${SESSION_HOURS}h` });
  setSessionCookie(res, token);
  res.json({ success: true, admin: { email: adminEmail } });
});

router.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  res.json({ success: true });
});

// Lets the frontend check whether the session cookie is still valid.
router.get("/me", requireAdmin, (req, res) => {
  res.json({ success: true, admin: { email: req.admin.email } });
});

module.exports = router;
