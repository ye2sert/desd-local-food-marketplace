
const stock = {
  "PRD-101": 10,
  "PRD-102": 20,
  "PRD-201": 5,
  "PRD-202": 15,
  "PRD-301": 8
};

// Example seasonal availability for testing.
// Replace with your group's actual product data.
const inSeason = {
  "PRD-101": true,
  "PRD-102": true,
  "PRD-201": true,
  "PRD-202": false,
  "PRD-301": true
};

function checkStock(items) {
  const stockIssues = [];

  for (const item of items) {
    const available = stock[item.productId] ?? 0;
    const isInSeason = inSeason[item.productId] === true;

    if (!isInSeason || available < item.quantity || item.quantity <= 0) {
      stockIssues.push({
        productId: item.productId,
        productName: item.productName,
        requested: item.quantity,
        available,
        reason: !isInSeason
          ? "Product unavailable or out of season"
          : item.quantity <= 0
          ? "Invalid quantity"
          : "Insufficient stock"
      });
    }
  }

  return {
    stockAvailable: stockIssues.length === 0,
    stockIssues
  };
}

module.exports = { checkStock };
