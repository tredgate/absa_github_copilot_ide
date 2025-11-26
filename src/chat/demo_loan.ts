import {
  evaluateLoan,
  defaultPolicy,
  LoanApplication,
  LoanEvaluation,
} from "./loan_evaluator.ts";

function printResult(title: string, result: LoanEvaluation): void {
  console.log("----------------------------------------");
  console.log(`Scenario: ${title}`);
  console.log(`Applicant: ${result.applicantId}`);
  console.log(`Decision:  ${result.decision}`);
  console.log(`Score:     ${result.score}`);
  console.log(`Reasons:`);
  for (const reason of result.reasons) {
    console.log(`  - ${reason}`);
  }
  console.log("Metrics:");
  console.log(
    `  DTI: ${result.metrics.debtToIncome}, ` +
      `LTV: ${result.metrics.loanToValue}, ` +
      `CreditNorm: ${result.metrics.creditScoreNormalized}`
  );

  // Pokud chceš vidět celý objekt:
  // console.log(JSON.stringify(result, null, 2));
}

// 1) Silný klient – měl by projít (APPROVE)
const strongClient: LoanApplication = {
  applicantId: "CUST-STRONG",
  monthlyIncome: 60_000,
  monthlyExpenses: 15_000,
  requestedAmount: 1_000_000,
  collateralValue: 1_800_000,
  creditScore: 760,
};

// 2) Nízký příjem – měl by být REJECT kvůli příjmu
const lowIncomeClient: LoanApplication = {
  applicantId: "CUST-LOW-INCOME",
  monthlyIncome: 18_000, // pod defaultPolicy.minMonthlyIncome (20_000)
  monthlyExpenses: 5_000,
  requestedAmount: 300_000,
  collateralValue: 600_000,
  creditScore: 700,
};

// 3) Vysoké DTI – vysoké výdaje vůči příjmu (REJECT kvůli DTI)
const highDtiClient: LoanApplication = {
  applicantId: "CUST-HIGH-DTI",
  monthlyIncome: 40_000,
  monthlyExpenses: 25_000, // DTI bude vysoké
  requestedAmount: 500_000,
  collateralValue: 800_000,
  creditScore: 680,
};

// 4) Vysoké LTV – půjčka příliš velká k zástavě (REJECT kvůli LTV)
const highLtvClient: LoanApplication = {
  applicantId: "CUST-HIGH-LTV",
  monthlyIncome: 55_000,
  monthlyExpenses: 10_000,
  requestedAmount: 900_000,
  collateralValue: 1_000_000, // LTV = 0.9 > 0.8
  creditScore: 720,
};

// 5) Bez kreditky, střední risk – ideálně REVIEW
const noCreditScoreClient: LoanApplication = {
  applicantId: "CUST-NO-CREDIT",
  monthlyIncome: 50_000,
  monthlyExpenses: 18_000,
  requestedAmount: 900_000,
  collateralValue: 1_500_000,
  // creditScore není – nový klient bez historie
};

function runDemo(): void {
  const apps: { title: string; app: LoanApplication }[] = [
    { title: "Strong client (expected APPROVE)", app: strongClient },
    { title: "Low income (expected REJECT – income)", app: lowIncomeClient },
    { title: "High DTI (expected REJECT – DTI)", app: highDtiClient },
    { title: "High LTV (expected REJECT – LTV)", app: highLtvClient },
    { title: "No credit score (expected REVIEW)", app: noCreditScoreClient },
  ];

  console.log("Loan evaluation demo");
  console.log("Policy:", defaultPolicy);
  console.log("========================================\n");

  for (const { title, app } of apps) {
    const result = evaluateLoan(app, defaultPolicy);
    printResult(title, result);
    console.log(); // prázdný řádek mezi scénáři
  }
}

runDemo();
