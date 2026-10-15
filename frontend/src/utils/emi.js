// Monthly instalment for a loan repaid in equal monthly payments.
export function monthlyEmi(principal, annualRatePercent, months) {
  const r = annualRatePercent / 12 / 100;
  if (r === 0) return principal / months;
  const growth = Math.pow(1 + r, months);
  return (principal * r * growth) / (growth - 1);
}
