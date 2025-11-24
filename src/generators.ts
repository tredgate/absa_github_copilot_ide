function generateRandomPassword(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
}

const password = generateRandomPassword(12);
console.log("Generated Password:", password);

/**
 * Generates a random first name based on the specified sex.
 *
 * @param {("male" | "female")} [sex] - Optional parameter to specify the sex for name generation.
 *   - If "male" is specified, returns a random male name.
 *   - If "female" is specified, returns a random female name.
 *   - If omitted or undefined, returns a random name from both male and female names.
 *
 * @returns {string} A randomly selected first name from the appropriate name list.
 *
 * @example
 * // Generate a random female name
 * const femaleName = generateFirstName("female");
 * // Returns one of: "Emma", "Olivia", "Ava", "Isabella", "Sophia", "Mia", "Charlotte", "Amelia"
 *
 * @example
 * // Generate a random male name
 * const maleName = generateFirstName("male");
 * // Returns one of: "Liam", "Noah", "Oliver", "James", "Elijah", "William", "Henry", "Lucas"
 *
 * @example
 * // Generate a random name from both male and female names
 * const anyName = generateFirstName();
 * // Returns any name from the combined list of male and female names
 */
function generateFirstName(sex?: "male" | "female"): string {
  const femaleNames = [
    "Emma",
    "Olivia",
    "Ava",
    "Isabella",
    "Sophia",
    "Mia",
    "Charlotte",
    "Amelia",
  ];
  const maleNames = [
    "Liam",
    "Noah",
    "Oliver",
    "James",
    "Elijah",
    "William",
    "Henry",
    "Lucas",
  ];

  let names: string[];
  if (sex === "female") {
    names = femaleNames;
  } else if (sex === "male") {
    names = maleNames;
  } else {
    names = [...femaleNames, ...maleNames];
  }

  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
}

const firstName = generateFirstName();
console.log("Generated First Name:", firstName);
