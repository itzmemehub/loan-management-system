const LoanApplication = require("../models/LoanApplication");

const filePath = (files, name) => {
  const file = files?.[name]?.[0];
  return file ? `/uploads/${file.filename}` : "";
};

const applyLoan = async (req, res) => {
  try {
    const { fullName, phone, email, loanType, loanAmount } = req.body;
    const amount = Number(loanAmount);

    if (!fullName || !phone || !email || !loanType || !Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Please provide all required loan details." });
    }

    const newApplication = await LoanApplication.create({
      fullName: String(fullName).trim(),
      phone: String(phone).trim(),
      email: String(email).trim(),
      loanType: String(loanType).trim(),
      loanAmount: amount,
      aadhaar: filePath(req.files, "aadhaar"),
      pan: filePath(req.files, "pan"),
      salarySlip: filePath(req.files, "salarySlip"),
      bankStatement: filePath(req.files, "bankStatement"),
      photo: filePath(req.files, "photo"),
    });

    res.status(201).json({
      success: true,
      message: "Loan Application Submitted Successfully",
      data: newApplication,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllApplications = async (_req, res) => {
  try {
    const applications = await LoanApplication.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLoanById = async (req, res) => {
  try {
    const loan = await LoanApplication.findById(req.params.id).lean();
    if (!loan) return res.status(404).json({ success: false, message: "Loan application not found" });
    res.json({ success: true, data: loan });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid application ID" });
  }
};

const deleteLoan = async (req, res) => {
  try {
    const loan = await LoanApplication.findByIdAndDelete(req.params.id);
    if (!loan) return res.status(404).json({ success: false, message: "Loan Application Not Found" });
    res.json({ success: true, message: "Loan Application Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid application ID" });
  }
};

module.exports = { applyLoan, getAllApplications, getLoanById, deleteLoan };
