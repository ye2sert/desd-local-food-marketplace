
const assert = require('node:assert/strict');
const { checkStock } = require('./worker.js');

// Test 1: Product available
const available = checkStock([
  {
    productId: 'PRD-202',
    productName: 'Milk',
    quantity: 2
  }
]);

assert.equal(available.allInStock, true);
assert.equal(available.stockAvailable, true);
assert.deepEqual(available.stockIssues, []);

console.log('PASS: Available product');

// Test 2: Insufficient stock
const insufficient = checkStock([
  {
    productId: 'PRD-101',
    productName: 'Apples',
    quantity: 9999
  }
]);

assert.equal(insufficient.allInStock, false);
assert.equal(
  insufficient.stockIssues[0].reason,
  'Insufficient stock'
);

console.log('PASS: Insufficient stock');

// Test 3: Invalid quantity
const invalid = checkStock([
  {
    productId: 'PRD-101',
    productName: 'Apples',
    quantity: 0
  }
]);

assert.equal(invalid.allInStock, false);
assert.equal(
  invalid.stockIssues[0].reason,
  'Invalid quantity'
);

console.log('PASS: Invalid quantity');

console.log('All stock-check tests passed.');
