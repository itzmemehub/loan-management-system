// Loan products offered on the site. Rates are indicative and only used for
// EMI estimates; the final rate is confirmed after review.
export const LOAN_TYPES = [
  {
    name: "Personal Loan", label: "Personal", rate: 11, maxYears: 5,
    min: 50000, max: 2500000, start: 300000, tone: "lilac", icon: "wallet",
    purpose: "Weddings, medical bills, travel, or clearing a costlier card balance.",
  },
  {
    name: "Business Loan", label: "Business", rate: 14, maxYears: 7,
    min: 100000, max: 5000000, start: 1000000, tone: "butter", icon: "shop",
    purpose: "Stock, machinery, a second outlet, or working capital between payments.",
  },
  {
    name: "Education Loan", label: "Education", rate: 9.5, maxYears: 10,
    min: 50000, max: 4000000, start: 800000, tone: "mint", icon: "cap",
    purpose: "Tuition, hostel and course fees, in India or abroad.",
  },
  {
    name: "Home Loan", label: "Home", rate: 8.5, maxYears: 30,
    min: 500000, max: 20000000, start: 4000000, tone: "peach", icon: "home",
    purpose: "Buying a flat or house, building on your plot, or renovating.",
  },
];

// Every value the application form accepts for loanType.
export const LOAN_TYPE_NAMES = [...LOAN_TYPES.map((loan) => loan.name), "Other"];

export const shortLoanName = (name = "") => name.replace(/ Loan$/, "");

// Colour tone used for a loan type's pill and card.
export const loanTone = (name) => LOAN_TYPES.find((loan) => loan.name === name)?.tone || "grey";
