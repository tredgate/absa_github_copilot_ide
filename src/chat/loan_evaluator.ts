/**
 * Represents the final decision for a loan application.
 * 
 * - `APPROVE`: Loan meets all criteria and is automatically approved
 * - `REJECT`: Loan fails one or more critical requirements
 * - `REVIEW`: Loan requires manual review by a loan officer
 */
export type Decision = 'APPROVE' | 'REJECT' | 'REVIEW';

/**
 * Represents a loan application submitted by an applicant.
 * 
 * @property applicantId - Unique identifier for the applicant (e.g., "CUST-001")
 * @property monthlyIncome - Applicant's monthly income in currency units (must be positive)
 * @property monthlyExpenses - Applicant's monthly expenses in currency units (cannot be negative)
 * @property requestedAmount - The loan amount requested in currency units (must be positive)
 * @property collateralValue - Value of collateral offered in currency units (must be positive)
 * @property creditScore - Credit score (300-850), optional for new clients without credit history
 * @property loanTermMonths - Loan duration in months, optional (used for payment analysis)
 * 
 * @example
 * ```typescript
 * const application: LoanApplication = {
 *   applicantId: 'CUST-001',
 *   monthlyIncome: 50_000,
 *   monthlyExpenses: 15_000,
 *   requestedAmount: 1_000_000,
 *   collateralValue: 1_500_000,
 *   creditScore: 710,
 *   loanTermMonths: 240
 * };
 * ```
 */
export interface LoanApplication {
  applicantId: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  requestedAmount: number;
  collateralValue: number;
  creditScore?: number; // optional, e.g. not available for new clients
  loanTermMonths?: number; // optional, loan duration in months
}

/**
 * Defines the risk policy thresholds for loan evaluation.
 * 
 * @property maxDebtToIncome - Maximum allowed debt-to-income ratio (e.g., 0.40 = 40%)
 * @property maxLoanToValue - Maximum allowed loan-to-value ratio (e.g., 0.80 = 80%)
 * @property minMonthlyIncome - Minimum monthly income required to qualify for any loan
 * @property minCreditScore - Minimum acceptable credit score (typically 300-850 scale)
 * @property autoApproveScore - Risk score threshold for automatic approval (lower is better)
 * @property maxLoanTermMonths - Maximum allowed loan term in months (e.g., 360 for 30 years)
 * @property maxPaymentToIncome - Maximum allowed monthly payment to income ratio (e.g., 0.30 = 30%)
 * 
 * @example
 * ```typescript
 * const conservativePolicy: LoanPolicy = {
 *   maxDebtToIncome: 0.35,
 *   maxLoanToValue: 0.70,
 *   minMonthlyIncome: 30_000,
 *   minCreditScore: 680,
 *   autoApproveScore: 30,
 *   maxLoanTermMonths: 360,
 *   maxPaymentToIncome: 0.30
 * };
 * ```
 */
export interface LoanPolicy {
  maxDebtToIncome: number;   // e.g. 0.40 (40 %)
  maxLoanToValue: number;    // e.g. 0.80 (80 %)
  minMonthlyIncome: number;  // minimum income for any loan
  minCreditScore: number;    // minimal acceptable score
  autoApproveScore: number;  // below this score -> APPROVE
  maxLoanTermMonths: number; // maximum loan duration in months
  maxPaymentToIncome: number; // maximum payment-to-income ratio
}

/**
 * Contains calculated risk metrics for a loan application.
 * 
 * @property debtToIncome - Ratio of monthly expenses to monthly income (lower is better)
 * @property loanToValue - Ratio of requested loan amount to collateral value (lower is better)
 * @property creditScoreNormalized - Credit score normalized to 0..1 range (higher is better, 0.5 = unknown)
 * @property paymentToIncome - Ratio of monthly payment to monthly income (lower is better, undefined if no term)
 * 
 * @example
 * ```typescript
 * const metrics: RiskMetrics = {
 *   debtToIncome: 0.30,      // 30% of income goes to expenses
 *   loanToValue: 0.67,       // Loan is 67% of collateral value
 *   creditScoreNormalized: 0.75,  // Good credit score
 *   paymentToIncome: 0.25    // Monthly payment is 25% of income
 * };
 * ```
 */
export interface RiskMetrics {
  debtToIncome: number;
  loanToValue: number;
  creditScoreNormalized: number; // 0..1, higher = better
  paymentToIncome?: number; // optional, only when loan term is provided
}

/**
 * Contains the complete evaluation result for a loan application.
 * 
 * @property applicantId - Unique identifier of the applicant
 * @property decision - Final decision: APPROVE, REJECT, or REVIEW
 * @property score - Overall risk score (lower is better, weighted calculation)
 * @property reasons - Array of human-readable reasons explaining the decision
 * @property metrics - Calculated risk metrics used in the evaluation
 * 
 * @example
 * ```typescript
 * const evaluation: LoanEvaluation = {
 *   applicantId: 'CUST-001',
 *   decision: 'APPROVE',
 *   score: 28.5,
 *   reasons: ['Score within auto-approval range.'],
 *   metrics: {
 *     debtToIncome: 0.30,
 *     loanToValue: 0.67,
 *     creditScoreNormalized: 0.75
 *   }
 * };
 * ```
 */
export interface LoanEvaluation {
  applicantId: string;
  decision: Decision;
  score: number;
  reasons: string[];
  metrics: RiskMetrics;
}

/**
 * Default loan policy with moderate risk thresholds.
 * 
 * Used when no custom policy is provided to `evaluateLoan`.
 * Suitable for standard consumer loans with moderate risk tolerance.
 * 
 * @example
 * ```typescript
 * // Use default policy
 * const result = evaluateLoan(application);
 * 
 * // Or customize
 * const result = evaluateLoan(application, {
 *   ...defaultPolicy,
 *   maxDebtToIncome: 0.35
 * });
 * ```
 */
export const defaultPolicy: LoanPolicy = {
  maxDebtToIncome: 0.4,
  maxLoanToValue: 0.8,
  minMonthlyIncome: 20_000,
  minCreditScore: 620,
  autoApproveScore: 40,
  maxLoanTermMonths: 360,  // 30 years maximum
  maxPaymentToIncome: 0.3  // 30% maximum
};

/**
 * Evaluates a loan application against a given policy and returns a decision.
 * 
 * This function performs a comprehensive risk assessment by:
 * 1. Validating the application data
 * 2. Calculating risk metrics (DTI, LTV, credit score)
 * 3. Computing an overall risk score
 * 4. Making a decision based on policy thresholds
 * 
 * @param application - The loan application to evaluate
 * @param policy - The loan policy to apply (defaults to defaultPolicy)
 * 
 * @returns A complete loan evaluation with decision, score, reasons, and metrics
 * 
 * @throws {Error} If the application fails validation (e.g., negative values, missing required fields)
 * 
 * @example
 * ```typescript
 * // Basic usage with default policy
 * const application: LoanApplication = {
 *   applicantId: 'CUST-001',
 *   monthlyIncome: 50_000,
 *   monthlyExpenses: 15_000,
 *   requestedAmount: 1_000_000,
 *   collateralValue: 1_500_000,
 *   creditScore: 710
 * };
 * 
 * const result = evaluateLoan(application);
 * console.log(result.decision); // 'APPROVE'
 * console.log(result.score);    // 28.5
 * ```
 * 
 * @example
 * ```typescript
 * // Using custom policy
 * const strictPolicy: LoanPolicy = {
 *   maxDebtToIncome: 0.30,
 *   maxLoanToValue: 0.70,
 *   minMonthlyIncome: 30_000,
 *   minCreditScore: 700,
 *   autoApproveScore: 25
 * };
 * 
 * const result = evaluateLoan(application, strictPolicy);
 * ```
 * 
 * @example
 * ```typescript
 * // Handling applicant without credit score
 * const newApplicant: LoanApplication = {
 *   applicantId: 'CUST-002',
 *   monthlyIncome: 45_000,
 *   monthlyExpenses: 12_000,
 *   requestedAmount: 800_000,
 *   collateralValue: 1_200_000
 *   // creditScore is undefined
 * };
 * 
 * const result = evaluateLoan(newApplicant);
 * // Credit score treated as neutral (0.5)
 * ```
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
    creditScoreNormalized: normalizeCreditScore(application.creditScore)
  };

  // Calculate payment-to-income if loan term is provided
  if (application.loanTermMonths !== undefined) {
    const monthlyPayment = calculateMonthlyPayment(
      application.requestedAmount,
      application.loanTermMonths
    );
    metrics.paymentToIncome = calculatePaymentToIncome(
      monthlyPayment,
      application.monthlyIncome
    );
  }

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
      ...(metrics.paymentToIncome !== undefined && {
        paymentToIncome: round(metrics.paymentToIncome, 4)
      })
    }
  };
}

// ---------- Core calculations ----------

function calculateDebtToIncome(expenses: number, income: number): number {
  if (income <= 0) return Infinity;
  return expenses / income;
}

function calculateLoanToValue(loanAmount: number, collateralValue: number): number {
  if (collateralValue <= 0) return Infinity;
  return loanAmount / collateralValue;
}

/**
 * Calculate monthly payment using simple amortization formula.
 * Assumes a fixed interest rate (default 5% annual).
 * 
 * Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 * Where: M = monthly payment, P = principal, r = monthly rate, n = number of payments
 */
function calculateMonthlyPayment(
  loanAmount: number, 
  termMonths: number, 
  annualInterestRate: number = 0.05
): number {
  if (termMonths <= 0) return Infinity;
  if (loanAmount <= 0) return 0;
  
  // If interest rate is 0, simple division
  if (annualInterestRate === 0) {
    return loanAmount / termMonths;
  }
  
  const monthlyRate = annualInterestRate / 12;
  const numerator = monthlyRate * Math.pow(1 + monthlyRate, termMonths);
  const denominator = Math.pow(1 + monthlyRate, termMonths) - 1;
  
  return loanAmount * (numerator / denominator);
}

/**
 * Calculate payment-to-income ratio.
 */
function calculatePaymentToIncome(monthlyPayment: number, income: number): number {
  if (income <= 0) return Infinity;
  return monthlyPayment / income;
}

/**
 * Normalize credit score to 0..1 (300..850 mapped to 0..1).
 * Unknown score -> neutral 0.5.
 */
function normalizeCreditScore(score?: number): number {
  if (typeof score !== 'number') return 0.5;

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
      `Debt-to-income too high (${toPercent(metrics.debtToIncome)} > ${toPercent(policy.maxDebtToIncome)}).`
    );
  }

  if (metrics.loanToValue > policy.maxLoanToValue) {
    reasons.push(
      `Loan-to-value too high (${toPercent(metrics.loanToValue)} > ${toPercent(policy.maxLoanToValue)}).`
    );
  }

  if (app.creditScore !== undefined && app.creditScore < policy.minCreditScore) {
    reasons.push(
      `Credit score too low (${app.creditScore} < ${policy.minCreditScore}).`
    );
  }

  // Check loan term duration
  if (app.loanTermMonths !== undefined && app.loanTermMonths > policy.maxLoanTermMonths) {
    reasons.push(
      `Loan term too long (${app.loanTermMonths} months > ${policy.maxLoanTermMonths} months).`
    );
  }

  // Check payment-to-income ratio
  if (metrics.paymentToIncome !== undefined && metrics.paymentToIncome > policy.maxPaymentToIncome) {
    reasons.push(
      `Monthly payment too high (${toPercent(metrics.paymentToIncome)} > ${toPercent(policy.maxPaymentToIncome)}).`
    );
  }

  if (reasons.length > 0) {
    return { decision: 'REJECT', reasons };
  }

  if (score <= policy.autoApproveScore) {
    reasons.push('Score within auto-approval range.');
    return { decision: 'APPROVE', reasons };
  }

  reasons.push('Requires manual review based on score and metrics.');
  return { decision: 'REVIEW', reasons };
}

// ---------- Validation & helpers ----------

function validateApplication(app: LoanApplication): void {
  const errors: string[] = [];

  if (!app.applicantId) errors.push('applicantId is required.');
  if (app.monthlyIncome <= 0) errors.push('monthlyIncome must be positive.');
  if (app.monthlyExpenses < 0) errors.push('monthlyExpenses cannot be negative.');
  if (app.requestedAmount <= 0) errors.push('requestedAmount must be positive.');
  if (app.collateralValue <= 0) errors.push('collateralValue must be positive.');
  if (app.loanTermMonths !== undefined && app.loanTermMonths <= 0) {
    errors.push('loanTermMonths must be positive if provided.');
  }

  if (errors.length > 0) {
    throw new Error(`LoanApplication validation failed: ${errors.join(' ')}`);
  }
}

function round(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function toPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

