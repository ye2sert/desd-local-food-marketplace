// Reads and writes the team's shared stock file, camunda/shared/stock.json.
// The checkout stock check (camunda/stock-service) reads the same file, so stock
// reduced here after payment is seen by the next checkout.
// Written with AI assistance; reviewed and understood by Mackenzie.

const fs = require('fs');
const path = require('path');

// STOCK_FILE can point somewhere else, e.g. a temporary file in the tests.
const STOCK_FILE = process.env.STOCK_FILE || path.join(__dirname, '..', '..', 'shared', 'stock.json');

function load(file = STOCK_FILE) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// Write to a temporary file first, then rename it over the real one, so the
// stock check never reads a half-written file.
function save(stock, file = STOCK_FILE) {
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(stock, null, 2) + '\n');
  fs.renameSync(tmp, file);
}

module.exports = { STOCK_FILE, load, save };
