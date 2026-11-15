// Tests for the payment decision. AI-assisted; reviewed by the team.
const test = require('node:test');
const assert = require('node:assert');
const { decidePayment } = require('./payment');

test('a payment succeeds in Sprint 2', () => {
  const result = decidePayment(25);
  assert.strictEqual(result.paymentStatus, 'SUCCESS');
  assert.match(result.transactionId, /^TXN-\d+$/);
});
