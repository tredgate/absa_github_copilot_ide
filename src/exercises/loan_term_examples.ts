/**
 * Loan Term Analysis Examples
 * 
 * This file demonstrates the loan evaluation system with various scenarios
 * including loan term duration and monthly payment analysis.
 * 
 * Run this file with: npx tsx src/exercises/loan_term_examples.ts
 */

import { 
  evaluateLoan, 
  LoanApplication, 
  LoanPolicy, 
  defaultPolicy 
} from '../chat/loan_evaluator';

// ---------------------------------------------------------
// SAMPLE LOAN APPLICATIONS
// ---------------------------------------------------------

const applications: LoanApplication[] = [
  {
    applicantId: 'CUST-001',
    monthlyIncome: 50_000,
    monthlyExpenses: 15_000,
    requestedAmount: 1_000_000,
    collateralValue: 1_500_000,
    creditScore: 710,
    loanTermMonths: 240  // 20 years - should APPROVE
  },
  {
    applicantId: 'CUST-002',
    monthlyIncome: 45_000,
    monthlyExpenses: 12_000,
    requestedAmount: 2_000_000,
    collateralValue: 2_500_000,
    creditScore: 680,
    loanTermMonths: 420  // 35 years - REJECT (exceeds 360 months)
  },
  {
    applicantId: 'CUST-003',
    monthlyIncome: 40_000,
    monthlyExpenses: 10_000,
    requestedAmount: 1_500_000,
    collateralValue: 2_000_000,
    creditScore: 700,
    loanTermMonths: 120  // 10 years - REJECT (monthly payment > 30% of income)
  },
  {
    applicantId: 'CUST-004',
    monthlyIncome: 60_000,
    monthlyExpenses: 18_000,
    requestedAmount: 1_200_000,
    collateralValue: 1_600_000,
    creditScore: 650,
    loanTermMonths: 300  // 25 years - should REVIEW
  },
  {
    applicantId: 'CUST-005',
    monthlyIncome: 55_000,
    monthlyExpenses: 14_000,
    requestedAmount: 900_000,
    collateralValue: 1_400_000,
    creditScore: 750,
    // No loanTermMonths - backward compatibility test, should APPROVE
  },
  {
    applicantId: 'CUST-006',
    monthlyIncome: 70_000,
    monthlyExpenses: 20_000,
    requestedAmount: 2_500_000,
    collateralValue: 3_000_000,
    creditScore: 720,
    loanTermMonths: 360  // Exactly 30 years - edge case, should pass term check
  }
];

// ---------------------------------------------------------
// EVALUATION LOGIC
// ---------------------------------------------------------

console.log('='.repeat(80));
console.log('LOAN TERM ANALYSIS - EVALUATION RESULTS');
console.log('='.repeat(80));
console.log();

applications.forEach((app, index) => {
  console.log(`\n${'─'.repeat(80)}`);
  console.log(`APPLICATION ${index + 1}: ${app.applicantId}`);
  console.log('─'.repeat(80));
  
  console.log('\n📋 Application Details:');
  console.log(`   Monthly Income:     ${app.monthlyIncome.toLocaleString()}`);
  console.log(`   Monthly Expenses:   ${app.monthlyExpenses.toLocaleString()}`);
  console.log(`   Requested Amount:   ${app.requestedAmount.toLocaleString()}`);
  console.log(`   Collateral Value:   ${app.collateralValue.toLocaleString()}`);
  console.log(`   Credit Score:       ${app.creditScore || 'N/A'}`);
  console.log(`   Loan Term:          ${app.loanTermMonths ? `${app.loanTermMonths} months (${(app.loanTermMonths / 12).toFixed(1)} years)` : 'Not specified'}`);
  
  try {
    const evaluation = evaluateLoan(app, defaultPolicy);
    
    console.log('\n📊 Risk Metrics:');
    console.log(`   Debt-to-Income:     ${(evaluation.metrics.debtToIncome * 100).toFixed(2)}%`);
    console.log(`   Loan-to-Value:      ${(evaluation.metrics.loanToValue * 100).toFixed(2)}%`);
    console.log(`   Credit Score (normalized): ${evaluation.metrics.creditScoreNormalized.toFixed(4)}`);
    if (evaluation.metrics.paymentToIncome !== undefined) {
      console.log(`   Payment-to-Income:  ${(evaluation.metrics.paymentToIncome * 100).toFixed(2)}%`);
    }
    console.log(`   Risk Score:         ${evaluation.score}`);
    
    console.log(`\n✓ DECISION: ${evaluation.decision}`);
    console.log('   Reasons:');
    evaluation.reasons.forEach(reason => {
      console.log(`   • ${reason}`);
    });
    
  } catch (error) {
    console.log(`\n✗ ERROR: ${error instanceof Error ? error.message : String(error)}`);
  }
});

console.log('\n' + '='.repeat(80));
console.log('POLICY THRESHOLDS USED');
console.log('='.repeat(80));
console.log(`Max Debt-to-Income:     ${(defaultPolicy.maxDebtToIncome * 100).toFixed(0)}%`);
console.log(`Max Loan-to-Value:      ${(defaultPolicy.maxLoanToValue * 100).toFixed(0)}%`);
console.log(`Min Monthly Income:     ${defaultPolicy.minMonthlyIncome.toLocaleString()}`);
console.log(`Min Credit Score:       ${defaultPolicy.minCreditScore}`);
console.log(`Auto-Approve Score:     ${defaultPolicy.autoApproveScore}`);
console.log(`Max Loan Term:          ${defaultPolicy.maxLoanTermMonths} months (${(defaultPolicy.maxLoanTermMonths / 12)} years)`);
console.log(`Max Payment-to-Income:  ${(defaultPolicy.maxPaymentToIncome * 100).toFixed(0)}%`);
console.log('='.repeat(80));
console.log();
