const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { requireAdmin } = require("../middleware/authMiddleware");
const { applyLoan, getAllApplications, getLoanById, deleteLoan } = require("../controllers/loanController");

router.post(
  "/apply",
  upload.fields([
    { name: "aadhaar", maxCount: 1 },
    { name: "pan", maxCount: 1 },
    { name: "salarySlip", maxCount: 1 },
    { name: "bankStatement", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  applyLoan
);

router.get("/", requireAdmin, getAllApplications);
router.get("/:id", requireAdmin, getLoanById);
router.delete("/:id", requireAdmin, deleteLoan);

module.exports = router;
