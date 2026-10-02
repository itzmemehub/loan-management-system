const mongoose = require("mongoose");

const loanApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    loanType: { type: String, default: "" },
    loanAmount: { type: Number, default: 0 },
    aadhaar: { type: String, default: "" },
    pan: { type: String, default: "" },
    salarySlip: { type: String, default: "" },
    bankStatement: { type: String, default: "" },
    photo: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LoanApplication", loanApplicationSchema);
