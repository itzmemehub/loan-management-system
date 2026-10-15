import { useMemo, useState } from "react";
import { LOAN_TYPES } from "../../config/loans";
import { monthlyEmi } from "../../utils/emi";

// State for the EMI calculator. Lives in HomePage because the loan cards
// ("Check EMI") and the apply links also read and change it.
export function useEmiCalculator() {
  const [typeIndex, setTypeIndex] = useState(0);
  const type = LOAN_TYPES[typeIndex];
  const [amount, setAmount] = useState(type.start);
  const [years, setYears] = useState(3);

  const chooseType = (index) => {
    const next = LOAN_TYPES[index];
    setTypeIndex(index);
    setAmount(next.start);
    setYears((current) => Math.min(current, next.maxYears));
  };

  const months = years * 12;
  const emi = useMemo(() => monthlyEmi(amount, type.rate, months), [amount, type.rate, months]);
  const totalPaid = emi * months;

  return {
    type,
    typeIndex,
    chooseType,
    amount,
    setAmount,
    years,
    setYears,
    emi,
    totalPaid,
    totalInterest: totalPaid - amount,
    // Passed as router state so the apply form opens prefilled.
    applyState: { loanType: type.name, loanAmount: String(amount) },
  };
}
