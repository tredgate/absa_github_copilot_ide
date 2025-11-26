/**
 * @description Represents the final decision on a loan application.
 * - APPROVE: Loan is automatically approved
 * - REJECT: Loan is rejected due to policy violations
 * - REVIEW: Loan requires manual review
 */
export type Decision = "APPROVE" | "REJECT" | "REVIEW";

/**
 * @description Contains all information about a loan application from an applicant.
 * This is the primary input for loan evaluation.
 *
 * @property {string} applicantId - Unique identifier for the applicant
 * @property {number} monthlyIncome - Applicant's monthly income in currency units
 * @property {number} monthlyExpenses - Applicant's monthly expenses in currency units
 * @property {number} requestedAmount - The loan amount requested
 * @property {number} collateralValue - Value of collateral offered for the loan
 * @property {number} [creditScore] - Credit score (300-850 range), optional for new clients
 */
export interface LoanApplication {
  applicantId: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  requestedAmount: number;
  collateralValue: number;
  creditScore?: number; // optional, e.g. not available for new clients
  loanTermMonths?: number; // optional, loan duration in months
  annualInterestRate?: number; // optional, annual interest rate (e.g., 0.05 for 5%)
}

/**
 * @description Defines the policy rules and thresholds for loan evaluation.
 * These parameters control the decision-making process.
 *
 * @property {number} maxDebtToIncome - Maximum acceptable debt-to-income ratio (0-1, e.g., 0.40 = 40%)
 * @property {number} maxLoanToValue - Maximum acceptable loan-to-value ratio (0-1, e.g., 0.80 = 80%)
 * @property {number} minMonthlyIncome - Minimum monthly income required for any loan
 * @property {number} minCreditScore - Minimum acceptable credit score
 * @property {number} autoApproveScore - Score threshold for automatic approval (lower is better)
 */
export interface LoanPolicy {
  maxDebtToIncome: number; // e.g. 0.40 (40 %)
  maxLoanToValue: number; // e.g. 0.80 (80 %)
  minMonthlyIncome: number; // minimum income for any loan
  minCreditScore: number; // minimal acceptable score
  autoApproveScore: number; // below this score -> APPROVE
  maxLoanTermMonths: number; // maximum loan duration in months (e.g., 360 for 30 years)
  maxPaymentToIncome: number; // maximum payment-to-income ratio (e.g., 0.30 for 30%)
}

/**
 * @description Contains calculated risk metrics for a loan application.
 * These metrics are used to assess the risk level of the loan.
 *
 * @property {number} debtToIncome - Ratio of monthly expenses to income (0-1+)
 * @property {number} loanToValue - Ratio of loan amount to collateral value (0-1+)
 * @property {number} creditScoreNormalized - Normalized credit score (0-1, where 1 is best)
 */
export interface RiskMetrics {
  debtToIncome: number;
  loanToValue: number;
  creditScoreNormalized: number; // 0..1, higher = better
  paymentToIncomeRatio: number; // monthly payment / monthly income
}

/**
 * @description The complete evaluation result for a loan application.
 * Contains the decision, risk score, detailed reasons, and calculated metrics.
 *
 * @property {string} applicantId - The applicant's unique identifier
 * @property {Decision} decision - The final decision (APPROVE, REJECT, or REVIEW)
 * @property {number} score - Overall risk score (lower is better)
 * @property {string[]} reasons - Human-readable explanations for the decision
 * @property {RiskMetrics} metrics - Calculated risk metrics
 */
export interface LoanEvaluation {
  applicantId: string;
  decision: Decision;
  score: number;
  reasons: string[];
  metrics: RiskMetrics;
}

/**
 * @description Default loan policy configuration used when no custom policy is provided.
 * Represents standard conservative lending criteria.
 *
 * @constant
 * @type {LoanPolicy}
 */
export const defaultPolicy: LoanPolicy = {
  maxDebtToIncome: 0.4,
  maxLoanToValue: 0.8,
  minMonthlyIncome: 20_000,
  minCreditScore: 620,
  autoApproveScore: 40,
  maxLoanTermMonths: 360,
  maxPaymentToIncome: 0.3,
};

/**
 * @description Evaluates a loan application against policy rules and calculates risk metrics.
 * This is the main entry point for loan evaluation. It validates the application,
 * calculates risk metrics (DTI, LTV, credit score), computes an overall risk score,
 * and makes a decision (APPROVE, REJECT, or REVIEW) based on the policy.
 *
 * @param {LoanApplication} application - The loan application to evaluate
 * @param {LoanPolicy} [policy=defaultPolicy] - The policy rules to apply (uses default if not provided)
 * @returns {LoanEvaluation} Complete evaluation with decision, score, reasons, and metrics
 * @throws {Error} If the application fails validation (missing required fields, invalid values)
 *
 * @example
 * // Example 1: High-quality applicant with good credit
 * const goodApp: LoanApplication = {
 *   applicantId: 'CUST-001',
 *   monthlyIncome: 50_000,
 *   monthlyExpenses: 15_000,
 *   requestedAmount: 1_000_000,
 *   collateralValue: 1_500_000,
 *   creditScore: 750
 * };
 * const result1 = evaluateLoan(goodApp);
 * // result1.decision === 'APPROVE'
 *
 * @example
 * // Example 2: Applicant with high debt-to-income ratio
 * const riskyApp: LoanApplication = {
 *   applicantId: 'CUST-002',
 *   monthlyIncome: 30_000,
 *   monthlyExpenses: 25_000,
 *   requestedAmount: 500_000,
 *   collateralValue: 600_000,
 *   creditScore: 680
 * };
 * const result2 = evaluateLoan(riskyApp);
 * // result2.decision === 'REJECT' (DTI = 83.3% > 40% threshold)
 *
 * @example
 * // Example 3: New client without credit score (requires review)
 * const newClientApp: LoanApplication = {
 *   applicantId: 'CUST-003',
 *   monthlyIncome: 40_000,
 *   monthlyExpenses: 12_000,
 *   requestedAmount: 800_000,
 *   collateralValue: 1_200_000
 * };
 * const result3 = evaluateLoan(newClientApp);
 * // result3.decision may be 'REVIEW' depending on calculated score
 *
 * @example
 * // Example 4: Using custom policy
 * const strictPolicy: LoanPolicy = {
 *   maxDebtToIncome: 0.30,
 *   maxLoanToValue: 0.70,
 *   minMonthlyIncome: 30_000,
 *   minCreditScore: 700,
 *   autoApproveScore: 30
 * };
 * const app: LoanApplication = {
 *   applicantId: 'CUST-004',
 *   monthlyIncome: 60_000,
 *   monthlyExpenses: 18_000,
 *   requestedAmount: 1_200_000,
 *   collateralValue: 2_000_000,
 *   creditScore: 720
 * };
 * const result4 = evaluateLoan(app, strictPolicy);
 * // Evaluated against stricter criteria
 */
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
    paymentToIncomeRatio: calculatePaymentToIncome(
      application.requestedAmount,
      application.loanTermMonths,
      application.annualInterestRate,
      application.monthlyIncome
    ),
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
      paymentToIncomeRatio: round(metrics.paymentToIncomeRatio, 4),
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
 * Calculate monthly payment using the standard amortization formula.
 * If term or rate is missing, returns 0 (payment calculation not possible).
 */
function calculateMonthlyPayment(
  loanAmount: number,
  termMonths?: number,
  annualRate?: number
): number {
  if (
    typeof termMonths !== "number" ||
    typeof annualRate !== "number" ||
    termMonths <= 0
  ) {
    return 0;
  }

  if (annualRate === 0) {
    return loanAmount / termMonths;
  }

  const monthlyRate = annualRate / 12;
  const payment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  return payment;
}

/**
 * Calculate payment-to-income ratio.
 * Returns 0 if payment calculation is not possible.
 */
function calculatePaymentToIncome(
  loanAmount: number,
  termMonths?: number,
  annualRate?: number,
  monthlyIncome?: number
): number {
  if (!monthlyIncome || monthlyIncome <= 0) return 0;

  const monthlyPayment = calculateMonthlyPayment(
    loanAmount,
    termMonths,
    annualRate
  );

  if (monthlyPayment === 0) return 0;

  return monthlyPayment / monthlyIncome;
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
 * We weight DTI, LTV, credit score, and payment-to-income ratio.
 */
function calculateScore(metrics: RiskMetrics): number {
  const dtiWeight = 40;
  const ltvWeight = 25;
  const creditWeight = 20;
  const paymentToIncomeWeight = 15;

  const dtiPenalty = metrics.debtToIncome * dtiWeight;
  const ltvPenalty = metrics.loanToValue * ltvWeight;
  const creditPenalty = (1 - metrics.creditScoreNormalized) * creditWeight;
  const paymentPenalty = metrics.paymentToIncomeRatio * paymentToIncomeWeight;

  return dtiPenalty + ltvPenalty + creditPenalty + paymentPenalty;
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

  // Check loan term constraints (triggers REVIEW, not REJECT)
  const reviewReasons: string[] = [];

  if (
    app.loanTermMonths !== undefined &&
    app.loanTermMonths > policy.maxLoanTermMonths
  ) {
    reviewReasons.push(
      `Loan term exceeds maximum (${app.loanTermMonths} months > ${policy.maxLoanTermMonths} months).`
    );
  }

  if (
    metrics.paymentToIncomeRatio > 0 &&
    metrics.paymentToIncomeRatio > policy.maxPaymentToIncome
  ) {
    reviewReasons.push(
      `Payment-to-income ratio too high (${toPercent(
        metrics.paymentToIncomeRatio
      )} > ${toPercent(policy.maxPaymentToIncome)}).`
    );
  }

  if (reviewReasons.length > 0) {
    return { decision: "REVIEW", reasons: reviewReasons };
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
  if (app.loanTermMonths !== undefined && app.loanTermMonths <= 0)
    errors.push("loanTermMonths must be positive.");
  if (app.annualInterestRate !== undefined && app.annualInterestRate < 0)
    errors.push("annualInterestRate cannot be negative.");

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
