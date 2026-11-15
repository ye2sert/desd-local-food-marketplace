
const fs = require('fs');
const path = require('path');

const stockFile = path.join(__dirname, '..', 'shared', 'stock.json');

// Temporary seasonal availability.
// Replace with the group's agreed product data.
const inSeason = {
  "PRD-101": true,
  "PRD-102": true,
  "PRD-201": true,
  "PRD-202": true,
  "PRD-301": true
};

function checkStock(items) {
  // Read fresh stock data for every checkout.
  const stock = JSON.parse(fs.readFileSync(stockFile, 'utf8'));
  const stockIssues = [];

  for (const item of items) {
    const available = stock[item.productId] ?? 0;
    const isInSeason = inSeason[item.productId] === true;

    if (
      !isInSeason ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0 ||
      available < item.quantity
    ) {
      stockIssues.push({
        productId: item.productId,
        productName: item.productName,
        requested: item.quantity,
        available,
        reason: !isInSeason
          ? "Product unavailable or out of season"
          : !Number.isInteger(item.quantity) || item.quantity <= 0
          ? "Invalid quantity"
          : "Insufficient stock"
      });
    }
  }

  const allInStock = stockIssues.length === 0;

  return {
    allInStock,
    stockAvailable: allInStock,
    stockIssues
  };
}

module.exports = { checkStock };

