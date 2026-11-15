// Tests for the checkout logic. AI-assisted; reviewed by the team.
const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const {
  identifyProducers,
  determineDelivery,
  stockIssueMessages,
  FALLBACK_DELIVERY,
} = require('./checkout');

const basket = require(path.join(__dirname, '..', 'test-data', 'sample-basket.json'));
const atReview = require(path.join(__dirname, '..', 'test-data', 'review-order-variables.json'));
const producers = require(path.join(__dirname, '..', '..', 'shared', 'producers.json'));

test('the sample basket produces exactly the data the review-order form was tested with', () => {
  const result = determineDelivery(identifyProducers(basket.items), producers);
  assert.deepStrictEqual(result.producerOrders, atReview.producerOrders);
  assert.strictEqual(result.orderTotal, atReview.orderTotal);
});

test('each producer only gets their own items, in basket order', () => {
  const orders = identifyProducers(basket.items);
  assert.deepStrictEqual(orders.map((o) => o.producerId), ['PROD-01', 'PROD-02', 'PROD-03']);
  for (const order of orders) {
    assert.ok(order.items.every((item) => item.producerId === order.producerId));
  }
  assert.strictEqual(orders.reduce((n, o) => n + o.items.length, 0), basket.items.length);
});

test('prices add up to the penny', () => {
  const orders = identifyProducers([
    { productId: 'A', productName: 'Apple', producerId: 'P1', producerName: 'Farm', quantity: 3, unitPrice: 0.1 },
    { productId: 'B', productName: 'Pear', producerId: 'P1', producerName: 'Farm', quantity: 1, unitPrice: 0.2 },
  ]);
  assert.strictEqual(orders[0].subtotal, 0.5);
  const { orderTotal } = determineDelivery(orders, {});
  assert.strictEqual(orderTotal, 0.5);
});

test('a producer without delivery details falls back to collection', () => {
  const orders = identifyProducers([
    { productId: 'X', productName: 'Honey', producerId: 'PROD-99', producerName: 'New Farm', quantity: 1, unitPrice: 6 },
  ]);
  const { producerOrders } = determineDelivery(orders, producers);
  assert.strictEqual(producerOrders[0].deliveryMethod, FALLBACK_DELIVERY);
});

test('an empty basket or missing producer orders is rejected', () => {
  assert.throws(() => identifyProducers([]), /no items/);
  assert.throws(() => identifyProducers(undefined), /no items/);
  assert.throws(() => determineDelivery([], producers), /no producer orders/);
});

test('stock issues become customer-friendly messages', () => {
  const messages = stockIssueMessages([
    { productId: 'PRD-201', productName: 'Mature cheddar 400g', requested: 2, available: 1, reason: 'INSUFFICIENT_STOCK' },
    { productId: 'PRD-301', productName: 'Sourdough loaf', requested: 1, available: 0, reason: 'OUT_OF_STOCK' },
    { productId: 'PRD-302', productName: 'Hot cross buns', requested: 1, available: 12, reason: 'OUT_OF_SEASON' },
    { productId: 'PRD-999', requested: 1, available: 0, reason: 'NOT_FOUND' },
  ]);
  assert.deepStrictEqual(messages, [
    'Mature cheddar 400g: only 1 left, you asked for 2',
    'Sourdough loaf: out of stock',
    'Hot cross buns: out of season, not available at the moment',
    'PRD-999: no longer available',
  ]);
  assert.deepStrictEqual(stockIssueMessages(undefined), []);
});
