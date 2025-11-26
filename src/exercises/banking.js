/**
 * Calculates the transaction fee for a banking operation.
 * 
 * @param {number} amount - The transaction amount to calculate the fee for
 * @param {boolean} isInternational - Whether the transaction is international (true) or domestic (false)
 * @returns {number} The total transaction fee, including base fee, international fee (if applicable), and percentage-based fee
 * 
 * @example
 * // Domestic transaction
 * calculateTransactionFee(100, false); // Returns 3.5 (2.5 base + 0 international + 1% of 100)
 * 
 * @example
 * // International transaction
 * calculateTransactionFee(100, true); // Returns 8.5 (2.5 base + 5 international + 1% of 100)
 */
function calculateTransactionFee(amount, isInternational) {
    const baseFee = 2.5;
    const internationalFee = isInternational ? 5.0 : 0.0;
    return baseFee + internationalFee + (amount * 0.01);
}

const fee = calculateTransactionFee(1000, true);
console.log(`Transaction Fee: $${fee.toFixed(2)}`);

