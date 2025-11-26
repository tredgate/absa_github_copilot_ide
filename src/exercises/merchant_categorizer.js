// ---------------------------------------------------------
// STARTER CODE
// ---------------------------------------------------------

const rawTransactions = [
  { id: "T1", amount: -50.0, mcc: 5411, desc: "Tesco Market" },
  { id: "T2", amount: -12.5, mcc: 5812, desc: "Starbucks" },
  { id: "T3", amount: -120.0, mcc: 3000, desc: "United Airlines" },
  { id: "T4", amount: -45.0, mcc: 5411, desc: "Lidl" },
  { id: "T5", amount: -200.0, mcc: 5732, desc: "Best Buy Electronics" },
  { id: "T6", amount: -15.0, mcc: 0, desc: "Unknown Vendor" },
  { id: "T7", amount: 1000.0, mcc: 0, desc: "Salary" },
  { id: "T8", amount: -30.0, mcc: 5812, desc: "McDonald's" },
  { id: "T9", amount: -25.0, mcc: 1234, desc: "Some Other Store" },
  { id: "T10", amount: -60.0, mcc: 5732, desc: "Apple Store" },
];

// TODO: Create Categorization Logic (Function)
// TODO: Log results

function categorizeTransactions(transactions) {
    const mccCategoryMap = {
        5411: "Grocery Stores",
        5812: "Eating Places and Restaurants",
        3000: "Airlines",
        5732: "Electronics Stores",
    };
    return transactions.map(tx => {
        const category = mccCategoryMap[tx.mcc] || "Other";
        return { ...tx, category };
    }
    );
}

const categorizedTransactions = categorizeTransactions(rawTransactions);
console.log(JSON.stringify(categorizedTransactions, null, 2));