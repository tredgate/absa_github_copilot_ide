// src/
// generators.js

function generateRandomPassword(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }
    return password;
}

const password = generateRandomPassword(16);
console.log(`Generated Password: ${password}`);

function generateFirstName(sex) {
    const maleNames = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher'];
    const femaleNames = ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen'];
    
    const names = sex === 'female' ? femaleNames : maleNames;
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
}

const maleFirstName = generateFirstName('male');
const femaleFirstName = generateFirstName('female');
console.log(`Male First Name: ${maleFirstName}`);
console.log(`Female First Name: ${femaleFirstName}`);