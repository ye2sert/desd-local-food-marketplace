// Unit tests for logic.js (US9, US10). Run with: node --test
// Written with AI assistance; reviewed and understood by Mackenzie.
const test = require('node:test');
const assert = require('node:assert/strict');
const logic = require('./logic');

const items = [
  { productId: 'PRD-101', productName: 'Free-range eggs', producerId: 'P1', producerName: 'Hillside Farm', quantity: 2, unitPrice: 3.2 },
  { productId: 'PRD-201', productName: 'Sourdough loaf', producerId: 'P2', producerName: 'Avon Bakery', quantity: 1, unitPrice: 4.5 },
  { productId: 'PRD-202', productName: 'Strawberry jam', producerId: 'P2', producerName: 'Avon Bakery', quantity: 3, unitPrice: 3.99 },
];
const seedStock = { 'PRD-101': 20, 'PRD-102': 30, 'PRD-201': 15, 'PRD-202': 25, 'PRD-301': 10 };

test('create-order gives an ORD- id and CREATED status', () => {
  assert.deepEqual(logic.createOrder(1700000000000), { orderId: 'ORD-1700000000000', orderStatus: 'CREATED' });
});

test('split: each producer only receives their own items', () => {
  const parts = logic.splitOrderByProducer({ orderId: 'ORD-1', items });
  assert.equal(parts.length, 2);
  for (const part of parts) {
    assert.ok(part.items.every((i) => i.producerId === part.producerId));
  }
  assert.deepEqual(parts.find((p) => p.producerId === 'P2').items.map((i) => i.productId), ['PRD-201', 'PRD-202']);
});

test('split: adds producerOrderId and keeps checkout fields', () => {
  const fromCheckout = [
    { producerId: 'P1', producerName: 'Hillside Farm', items: [items[0]], subtotal: 6.4, deliveryMethod: 'collection' },
  ];
  const [part] = logic.splitOrderByProducer({ orderId: 'ORD-9', producerOrders: fromCheckout });
  assert.equal(part.producerOrderId, 'ORD-9-P1');
  assert.equal(part.deliveryMethod, 'collection');
  assert.equal(part.subtotal, 6.4);
});

test('split: an item from another producer is not passed on', () => {
  const mixed = [{ producerId: 'P1', producerName: 'Hillside Farm', items: [items[0], items[1]], subtotal: 0, deliveryMethod: 'delivery' }];
  const [part] = logic.splitOrderByProducer({ orderId: 'ORD-2', producerOrders: mixed });
  assert.deepEqual(part.items.map((i) => i.productId), ['PRD-101']);
});

test('stock: reduced by the ordered quantity', () => {
  const { stock, stockUpdates } = logic.reduceStock(seedStock, items);
  assert.equal(stock['PRD-101'], 18);
  assert.deepEqual(stockUpdates.find((u) => u.productId === 'PRD-202'), { productId: 'PRD-202', newQuantity: 22, available: true });
});

test('stock: becomes unavailable at exactly 0', () => {
  const { stockUpdates } = logic.reduceStock(seedStock, [{ productId: 'PRD-301', quantity: 10 }]);
  assert.deepEqual(stockUpdates, [{ productId: 'PRD-301', newQuantity: 0, available: false }]);
});

test('stock: never goes negative and the original is unchanged on failure', () => {
  const before = { ...seedStock };
  assert.throws(() => logic.reduceStock(seedStock, [{ productId: 'PRD-301', quantity: 11 }]), /Not enough stock/);
  assert.deepEqual(seedStock, before);
});

test('stock: same product twice in one order is counted together', () => {
  assert.throws(
    () => logic.reduceStock(seedStock, [{ productId: 'PRD-301', quantity: 6 }, { productId: 'PRD-301', quantity: 5 }]),
    /Not enough stock/
  );
});

test('commission: 5% per producer, rounded to 2 dp', () => {
  const parts = logic.splitOrderByProducer({ orderId: 'ORD-1', items });
  const r = logic.calculateCommission(parts, 22.87);
  const p1 = r.producerAmounts.find((p) => p.producerId === 'P1');
  assert.deepEqual([p1.gross, p1.commission, p1.net], [6.4, 0.32, 6.08]);
  assert.equal(r.marketplaceCommission, 1.14); // 0.32 + 0.82 (5% of 16.47 = 0.8235)
});

test('commission invariant holds for awkward pennies', () => {
  const cases = [
    [0.01, 0.09, 0.1],
    [33.33, 33.33, 33.34],
    [0.49, 10.1, 7.07],
    [19.99],
    [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
  ];
  for (const subtotals of cases) {
    const producerOrders = subtotals.map((s, i) => ({ producerId: `P${i}`, producerName: `Producer ${i}`, subtotal: s }));
    const orderTotal = logic.round2(subtotals.reduce((a, b) => a + b, 0));
    const r = logic.calculateCommission(producerOrders, orderTotal);
    const netPence = r.producerAmounts.reduce((s, p) => s + Math.round(p.net * 100), 0);
    assert.equal(netPence + Math.round(r.marketplaceCommission * 100), Math.round(orderTotal * 100), `failed for ${subtotals}`);
  }
});

test('commission: mismatched order total is rejected', () => {
  assert.throws(() => logic.calculateCommission([{ producerId: 'P1', subtotal: 10 }], 10.01), /do not equal/);
});

test('notify: only that producer’s items and requiredBy at least 48h ahead', () => {
  const now = Date.parse('2026-11-14T10:00:00Z');
  const [, p2] = logic.splitOrderByProducer({ orderId: 'ORD-1', items });
  const msg = logic.buildProducerNotification(p2, now);
  assert.match(msg.text, /1 x Sourdough loaf, 3 x Strawberry jam/);
  assert.doesNotMatch(msg.text, /eggs/);
  assert.ok(Date.parse(msg.requiredBy) - now >= 48 * 60 * 60 * 1000);
  assert.equal(msg.requiredBy, new Date(msg.requiredBy).toISOString());
});
