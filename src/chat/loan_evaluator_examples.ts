import {
  evaluateLoan,
  LoanApplication,
  LoanEvaluation,
} from "./loan_evaluator";

/**
 * @description Demonstration of the loan evaluator with various scenarios
 * using realistic Czech banking values (amounts in CZK)
 */

// Scenario 1: High-income applicant with excellent credit → APPROVE
const highIncomeApplicant: LoanApplication = {
  applicantId: "CZ-2024-001",
  monthlyIncome: 120_000, // 120k CZK/month (~5,000 EUR)
  monthlyExpenses: 35_000, // 35k CZK/month
  requestedAmount: 2_500_000, // 2.5M CZK (~100k EUR)
  collateralValue: 3_500_000, // 3.5M CZK (property value)
  creditScore: 780, // Excellent credit
};

// Scenario 2: Low credit score applicant → REJECT
const lowCreditApplicant: LoanApplication = {
  applicantId: "CZ-2024-002",
  monthlyIncome: 45_000, // 45k CZK/month
  monthlyExpenses: 18_000, // 18k CZK/month
  requestedAmount: 800_000, // 800k CZK
  collateralValue: 1_200_000, // 1.2M CZK
  creditScore: 580, // Below minimum (620)
};

// Scenario 3: High debt-to-income ratio → REJECT
const highDebtApplicant: LoanApplication = {
  applicantId: "CZ-2024-003",
  monthlyIncome: 55_000, // 55k CZK/month
  monthlyExpenses: 48_000, // 48k CZK/month (87% DTI!)
  requestedAmount: 1_500_000, // 1.5M CZK
  collateralValue: 2_000_000, // 2M CZK
  creditScore: 680, // Decent credit
};

// Scenario 4: Edge case requiring manual review → REVIEW
const reviewCaseApplicant: LoanApplication = {
  applicantId: "CZ-2024-004",
  monthlyIncome: 65_000, // 65k CZK/month
  monthlyExpenses: 24_000, // 24k CZK/month (37% DTI - just under limit)
  requestedAmount: 1_800_000, // 1.8M CZK
  collateralValue: 2_400_000, // 2.4M CZK (75% LTV - just under limit)
  creditScore: 650, // Acceptable but not great
};

// Scenario 5: New client without credit score → REVIEW
const newClientApplicant: LoanApplication = {
  applicantId: "CZ-2024-005",
  monthlyIncome: 75_000, // 75k CZK/month
  monthlyExpenses: 22_000, // 22k CZK/month (29% DTI - good)
  requestedAmount: 1_200_000, // 1.2M CZK
  collateralValue: 1_800_000, // 1.8M CZK (67% LTV - good)
  // creditScore: undefined - new client without credit history
};

// Helper function to format and log evaluation results
function logEvaluation(scenarioName: string, evaluation: LoanEvaluation): void {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Scenario: ${scenarioName}`);
  console.log(`${"=".repeat(60)}`);
  console.log(`Applicant ID: ${evaluation.applicantId}`);
  console.log(`Decision: ${evaluation.decision}`);
  console.log(`Risk Score: ${evaluation.score} (lower is better)`);
  console.log(`\nRisk Metrics:`);
  console.log(
    `  - Debt-to-Income: ${(evaluation.metrics.debtToIncome * 100).toFixed(1)}%`
  );
  console.log(
    `  - Loan-to-Value: ${(evaluation.metrics.loanToValue * 100).toFixed(1)}%`
  );
  console.log(
    `  - Credit Score (normalized): ${(
      evaluation.metrics.creditScoreNormalized * 100
    ).toFixed(1)}%`
  );
  console.log(`\nReasons:`);
  evaluation.reasons.forEach((reason, index) => {
    console.log(`  ${index + 1}. ${reason}`);
  });
}

// Run all scenarios
console.log("\n🏦 LOAN EVALUATOR - DEMONSTRATION SCENARIOS");
console.log("Using realistic Czech banking values (CZK)\n");

const scenario1 = evaluateLoan(highIncomeApplicant);
logEvaluation("High-Income Applicant (Expected: APPROVE)", scenario1);

const scenario2 = evaluateLoan(lowCreditApplicant);
logEvaluation("Low Credit Score Applicant (Expected: REJECT)", scenario2);

const scenario3 = evaluateLoan(highDebtApplicant);
logEvaluation("High Debt-to-Income Ratio (Expected: REJECT)", scenario3);

const scenario4 = evaluateLoan(reviewCaseApplicant);
logEvaluation("Edge Case Near Limits (Expected: REVIEW)", scenario4);

const scenario5 = evaluateLoan(newClientApplicant);
logEvaluation("New Client Without Credit Score (Expected: REVIEW)", scenario5);

console.log(`\n${"=".repeat(60)}`);
console.log("Demonstration complete!");
console.log(`${"=".repeat(60)}\n`);

// Export scenarios for potential testing
export {
  highIncomeApplicant,
  lowCreditApplicant,
  highDebtApplicant,
  reviewCaseApplicant,
  newClientApplicant,
};
