require("node:dns").setServers(["8.8.8.8", "8.8.4.4"]);

const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const loanRoutes = require("./routes/loanRoutes");
const authRoutes = require("./routes/authRoutes");
const { requireAdmin } = require("./middleware/authMiddleware");

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Hosts like Railway and Render terminate HTTPS at a proxy; trust it so
// secure cookies are sent.
app.set("trust proxy", 1);

// The session cookie is only sent to origins listed here. Comma separated,
// e.g. CLIENT_ORIGIN=https://loanflow.netlify.app
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin)),
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Uploaded customer documents (Aadhaar, PAN, bank statements...) are stored in
// /backend/uploads. Only the signed-in admin can open them.
app.use("/uploads", requireAdmin, express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/loans", loanRoutes);

app.get("/", (_req, res) => {
  res.json({ success: true, message: "Loan Management Backend Running 🚀" });
});

app.use((err, _req, res, _next) => {
  console.error("Request error:", err);
  res.status(400).json({
    success: false,
    message: err.message || "Upload/request failed.",
  });
});

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Uploads folder: ${path.join(__dirname, "uploads")}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

start();
