const pool = require('../db');

const CODE_LENGTH = 6;

function randomNumericCode() {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

// Generates a 6-digit numeric access code guaranteed unique among students.
async function generateUniqueAccessCode() {
  for (let attempt = 0; attempt < 20; attempt++) {
    const code = randomNumericCode();
    const [rows] = await pool.query('SELECT id FROM students WHERE access_code = ?', [code]);
    if (rows.length === 0) return code;
  }
  throw new Error('Could not generate a unique access code, please retry.');
}

module.exports = { generateUniqueAccessCode, CODE_LENGTH };
