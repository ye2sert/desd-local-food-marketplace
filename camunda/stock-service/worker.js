
const fs = require('fs');
const path = require('path');

const stockFile = path.join(
  __dirname,
  '..',
  'shared',
  'stock.json'
);

const inSeason = {
  "PRD-101": true,
  "PRD-102": true,
  "PRD-201": true,
  "PRD-202": true,
  "PRD-301": true
};

function checkStock(items) {
  const stock = JSON.parse(
    fs.readFileSync(stockFile, 'utf8')
  );

  const stockIssues = [];

  for (const item of items) {
    const available = stock[item.productId] ?? 0;
    const isInSeason = inSeason[item.productId] === true;

    let reason = null;

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      reason = "Invalid quantity";
    } else if (!isInSeason) {
      reason = "Product unavailable or out of season";
    } else if (available < item.quantity) {
      reason = "Insufficient stock";
    }

    if (reason) {
      stockIssues.push({
        productId: item.productId,
        productName: item.productName,
        requested: item.quantity,
        available,
        reason
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

