const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const loanRoutes = require("./routes/loanRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Uploaded customer documents are stored on this backend in /backend/uploads
// and are available through /uploads/<filename>.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
