export type Decision = "APPROVE" | "REJECT" | "REVIEW";

export interface LoanApplication {
  applicantId: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  requestedAmount: number;
  collateralValue: number;
  creditScore?: number; // optional, e.g. not available for new clients
}

export interface LoanPolicy {
  maxDebtToIncome: number; // e.g. 0.40 (40 %)
  maxLoanToValue: number; // e.g. 0.80 (80 %)
  minMonthlyIncome: number; // minimum income for any loan
  minCreditScore: number; // minimal acceptable score
  autoApproveScore: number; // below this score -> APPROVE
}

export interface RiskMetrics {
  debtToIncome: number;
  loanToValue: number;
  creditScoreNormalized: number; // 0..1, higher = better
}

export interface LoanEvaluation {
  applicantId: string;
  decision: Decision;
  score: number;
  reasons: string[];
  metrics: RiskMetrics;
}

// Simple default policy for demo purposes.
export const defaultPolicy: LoanPolicy = {
  maxDebtToIncome: 0.4,
  maxLoanToValue: 0.8,
  minMonthlyIncome: 20_000,
  minCreditScore: 620,
  autoApproveScore: 40,
};

export function evaluateLoan(
  application: LoanApplication,
  policy: LoanPolicy = defaultPolicy
): LoanEvaluation {
  validateApplication(application);

  const metrics: RiskMetrics = {
    debtToIncome: calculateDebtToIncome(
      application.monthlyExpenses,
      application.monthlyIncome
    ),
    loanToValue: calculateLoanToValue(
      application.requestedAmount,
      application.collateralValue
    ),
    creditScoreNormalized: normalizeCreditScore(application.creditScore),
  };

  const score = calculateScore(metrics);
  const { decision, reasons } = decide(application, metrics, score, policy);

  return {
    applicantId: application.applicantId,
    decision,
    score: round(score),
    reasons,
    metrics: {
      debtToIncome: round(metrics.debtToIncome, 4),
      loanToValue: round(metrics.loanToValue, 4),
      creditScoreNormalized: round(metrics.creditScoreNormalized, 4),
    },
  };
}

// ---------- Core calculations ----------

function calculateDebtToIncome(expenses: number, income: number): number {
  if (income <= 0) return Infinity;
  return expenses / income;
}

function calculateLoanToValue(
  loanAmount: number,
  collateralValue: number
): number {
  if (collateralValue <= 0) return Infinity;
  return loanAmount / collateralValue;
}

/**
 * Normalize credit score to 0..1 (300..850 mapped to 0..1).
 * Unknown score -> neutral 0.5.
 */
function normalizeCreditScore(score?: number): number {
  if (typeof score !== "number") return 0.5;

  const min = 300;
  const max = 850;
  const clamped = Math.min(Math.max(score, min), max);
  return (clamped - min) / (max - min);
}

/**
 * Very simple risk score: lower is better.
 * We just weight DTI, LTV and credit score.
 */
function calculateScore(metrics: RiskMetrics): number {
  const dtiWeight = 50;
  const ltvWeight = 30;
  const creditWeight = 20;

  const dtiPenalty = metrics.debtToIncome * dtiWeight;
  const ltvPenalty = metrics.loanToValue * ltvWeight;
  const creditPenalty = (1 - metrics.creditScoreNormalized) * creditWeight;

  return dtiPenalty + ltvPenalty + creditPenalty;
}

// ---------- Decision logic ----------

function decide(
  app: LoanApplication,
  metrics: RiskMetrics,
  score: number,
  policy: LoanPolicy
): { decision: Decision; reasons: string[] } {
  const reasons: string[] = [];

  if (app.monthlyIncome < policy.minMonthlyIncome) {
    reasons.push(
      `Monthly income too low (${app.monthlyIncome} < ${policy.minMonthlyIncome}).`
    );
  }

  if (metrics.debtToIncome > policy.maxDebtToIncome) {
    reasons.push(
      `Debt-to-income too high (${toPercent(
        metrics.debtToIncome
      )} > ${toPercent(policy.maxDebtToIncome)}).`
    );
  }

  if (metrics.loanToValue > policy.maxLoanToValue) {
    reasons.push(
      `Loan-to-value too high (${toPercent(metrics.loanToValue)} > ${toPercent(
        policy.maxLoanToValue
      )}).`
    );
  }

  if (
    app.creditScore !== undefined &&
    app.creditScore < policy.minCreditScore
  ) {
    reasons.push(
      `Credit score too low (${app.creditScore} < ${policy.minCreditScore}).`
    );
  }

  if (reasons.length > 0) {
    return { decision: "REJECT", reasons };
  }

  if (score <= policy.autoApproveScore) {
    reasons.push("Score within auto-approval range.");
    return { decision: "APPROVE", reasons };
  }

  reasons.push("Requires manual review based on score and metrics.");
  return { decision: "REVIEW", reasons };
}

// ---------- Validation & helpers ----------

function validateApplication(app: LoanApplication): void {
  const errors: string[] = [];

  if (!app.applicantId) errors.push("applicantId is required.");
  if (app.monthlyIncome <= 0) errors.push("monthlyIncome must be positive.");
  if (app.monthlyExpenses < 0)
    errors.push("monthlyExpenses cannot be negative.");
  if (app.requestedAmount <= 0)
    errors.push("requestedAmount must be positive.");
  if (app.collateralValue <= 0)
    errors.push("collateralValue must be positive.");

  if (errors.length > 0) {
    throw new Error(`LoanApplication validation failed: ${errors.join(" ")}`);
  }
}

function round(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function toPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * Example usage:
 *
 * const app: LoanApplication = {
 *   applicantId: 'CUST-001',
 *   monthlyIncome: 50_000,
 *   monthlyExpenses: 15_000,
 *   requestedAmount: 1_000_000,
 *   collateralValue: 1_500_000,
 *   creditScore: 710
 * };
 *
 * const result = evaluateLoan(app);
 * console.log(result);
 */
