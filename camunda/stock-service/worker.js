
const stock = {
  "PRD-101": 10,
  "PRD-102": 20,
  "PRD-201": 5,
  "PRD-202": 15,
  "PRD-301": 8
};

// Temporary seasonal availability.
// Replace with the group's agreed product data.
const inSeason = {
  "PRD-101": true,
  "PRD-102": true,
  "PRD-201": true,
  "PRD-202": true, // Milk is available
  "PRD-301": true
};

function checkStock(items) {
  const stockIssues = [];

  for (const item of items) {
    const available = stock[item.productId] ?? 0;
    const isInSeason = inSeason[item.productId] === true;

    if (
      !isInSeason ||
      available < item.quantity ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
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

