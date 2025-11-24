import {
  evaluateLoan,
  defaultPolicy,
  LoanApplication,
} from "./loan_evaluator.ts";

const app: LoanApplication = {
  applicantId: "CUST-001",
  monthlyIncome: 50_000,
  monthlyExpenses: 15_000,
  requestedAmount: 1_000_000,
  collateralValue: 1_500_000,
  creditScore: 710,
};

const result = evaluateLoan(app, defaultPolicy);

console.log("Loan evaluation result:");
console.log(JSON.stringify(result, null, 2));
