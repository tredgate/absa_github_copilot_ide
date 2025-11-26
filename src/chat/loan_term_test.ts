import { evaluateLoan, LoanApplication } from "./loan_evaluator";

console.log("=== Loan Term Analysis Tests ===\n");

// Test 1: Normal loan with term and rate (should APPROVE or REVIEW based on score)
const normalLoan: LoanApplication = {
  applicantId: "CUST-001",
  monthlyIncome: 50_000,
  monthlyExpenses: 15_000,
  requestedAmount: 1_000_000,
  collateralValue: 1_500_000,
  creditScore: 750,
  loanTermMonths: 240, // 20 years
  annualInterestRate: 0.05, // 5%
};

console.log("Test 1: Normal 20-year loan at 5%");
const result1 = evaluateLoan(normalLoan);
console.log(`Decision: ${result1.decision}`);
console.log(`Score: ${result1.score}`);
console.log(
  `Payment-to-Income: ${(result1.metrics.paymentToIncomeRatio * 100).toFixed(
    2
  )}%`
);
console.log(`Reasons: ${result1.reasons.join(", ")}`);
console.log();

// Test 2: Long-term loan (>360 months) - should trigger REVIEW
const longTermLoan: LoanApplication = {
  applicantId: "CUST-002",
  monthlyIncome: 60_000,
  monthlyExpenses: 18_000,
  requestedAmount: 2_000_000,
  collateralValue: 3_000_000,
  creditScore: 720,
  loanTermMonths: 420, // 35 years - exceeds 360 month limit
  annualInterestRate: 0.045, // 4.5%
};

console.log("Test 2: Long-term loan (35 years, exceeds 360 months)");
const result2 = evaluateLoan(longTermLoan);
console.log(`Decision: ${result2.decision}`);
console.log(`Score: ${result2.score}`);
console.log(`Loan Term: ${longTermLoan.loanTermMonths} months`);
console.log(`Reasons: ${result2.reasons.join(", ")}`);
console.log();

// Test 3: High payment-to-income ratio (>30%) - should trigger REVIEW
const highPaymentLoan: LoanApplication = {
  applicantId: "CUST-003",
  monthlyIncome: 30_000,
  monthlyExpenses: 10_000,
  requestedAmount: 1_500_000,
  collateralValue: 2_000_000,
  creditScore: 700,
  loanTermMonths: 120, // 10 years - short term = high payments
  annualInterestRate: 0.06, // 6%
};

console.log("Test 3: High payment-to-income ratio (short term, high payments)");
const result3 = evaluateLoan(highPaymentLoan);
console.log(`Decision: ${result3.decision}`);
console.log(`Score: ${result3.score}`);
console.log(
  `Payment-to-Income: ${(result3.metrics.paymentToIncomeRatio * 100).toFixed(
    2
  )}%`
);
console.log(`Reasons: ${result3.reasons.join(", ")}`);
console.log();

// Test 4: Loan without term/rate (backward compatibility) - should still work
const noTermLoan: LoanApplication = {
  applicantId: "CUST-004",
  monthlyIncome: 45_000,
  monthlyExpenses: 12_000,
  requestedAmount: 800_000,
  collateralValue: 1_200_000,
  creditScore: 680,
};

console.log("Test 4: Loan without term/rate (backward compatibility)");
const result4 = evaluateLoan(noTermLoan);
console.log(`Decision: ${result4.decision}`);
console.log(`Score: ${result4.score}`);
console.log(
  `Payment-to-Income: ${result4.metrics.paymentToIncomeRatio} (should be 0)`
);
console.log(`Reasons: ${result4.reasons.join(", ")}`);
console.log();

// Test 5: Both violations (long term + high payment ratio)
const doubleViolation: LoanApplication = {
  applicantId: "CUST-005",
  monthlyIncome: 40_000,
  monthlyExpenses: 15_000,
  requestedAmount: 3_000_000,
  collateralValue: 4_000_000,
  creditScore: 710,
  loanTermMonths: 480, // 40 years
  annualInterestRate: 0.07, // 7%
};

console.log("Test 5: Both violations (long term + potential high payment)");
const result5 = evaluateLoan(doubleViolation);
console.log(`Decision: ${result5.decision}`);
console.log(`Score: ${result5.score}`);
console.log(`Loan Term: ${doubleViolation.loanTermMonths} months`);
console.log(
  `Payment-to-Income: ${(result5.metrics.paymentToIncomeRatio * 100).toFixed(
    2
  )}%`
);
console.log(`Reasons: ${result5.reasons.join(", ")}`);
