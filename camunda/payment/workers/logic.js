// Business logic for Payment & Order Processing (US9, US10). No Camunda imports, so it can be unit tested.
// Written with AI assistance; reviewed and understood by Mackenzie.

// The group must confirm with the tutor whether the 5% commission is deducted from
// the producer's share (current model) or added on top for the customer.
const COMMISSION_RATE = 0.05;
const COMMISSION_MODEL = 'deducted-from-producer';

// Producers need at least 48 hours' notice (case study, Producers).
const LEAD_TIME_HOURS = 48;

// Money is handled in whole pence internally so totals add up exactly,
// then converted back to pounds (2 dp) for the process variables.
const toPence = (pounds) => Math.round(Number(pounds) * 100);
const toPounds = (pence) => Number((pence / 100).toFixed(2));
const round2 = (pounds) => toPounds(toPence(pounds));

// create-order
function createOrder(now = Date.now()) {
  return { orderId: `ORD-${now}`, orderStatus: 'CREATED' };
}

// split-order-by-producer
// Uses the producerOrders from checkout if present; otherwise groups the items by producer.
// Each entry gets a producerOrderId "<orderId>-<producerId>".
function splitOrderByProducer({ orderId, items, producerOrders }) {
  if (!orderId) throw new Error('orderId is missing');

  let groups = producerOrders;
  if (!Array.isArray(groups) || groups.length === 0) {
    if (!Array.isArray(items) || items.length === 0) throw new Error('Order has no items');
    const byProducer = new Map();
    for (const item of items) {
      if (!byProducer.has(item.producerId)) {
        byProducer.set(item.producerId, {
          producerId: item.producerId,
          producerName: item.producerName,
          items: [],
          subtotal: 0,
          deliveryMethod: null,
        });
      }
      byProducer.get(item.producerId).items.push(item);
    }
    groups = [...byProducer.values()];
  }

  return groups.map((group) => {
    // Only this producer's items, and the subtotal worked out from them.
    const ownItems = group.items.filter((i) => i.producerId === group.producerId);
    const subtotalPence = ownItems.reduce((sum, i) => sum + toPence(i.unitPrice) * i.quantity, 0);
    return {
      ...group,
      items: ownItems,
      subtotal: toPounds(subtotalPence),
      producerOrderId: `${orderId}-${group.producerId}`,
    };
  });
}

// update-stock (US9). Only ever called after a successful payment.
// Returns the new stock and the updates; throws rather than letting stock go negative.
function reduceStock(stock, items) {
  const next = { ...stock };
  for (const item of items) {
    if (!(item.productId in next)) throw new Error(`Unknown product ${item.productId}`);
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error(`Invalid quantity for ${item.productId}`);
    }
    if (next[item.productId] < item.quantity) {
      throw new Error(
        `Not enough stock for ${item.productId}: ${next[item.productId]} left, ${item.quantity} ordered`
      );
    }
    next[item.productId] -= item.quantity;
  }
  const touched = [...new Set(items.map((i) => i.productId))];
  const stockUpdates = touched.map((productId) => ({
    productId,
    newQuantity: next[productId],
    available: next[productId] > 0,
  }));
  return { stock: next, stockUpdates };
}

// calculate-commission (US10)
// Per producer: gross = subtotal, commission = round(subtotal x 0.05, 2), net = gross - commission.
// Invariant: sum(net) + marketplaceCommission === orderTotal, to the penny.
function calculateCommission(producerOrders, orderTotal) {
  let commissionPence = 0;
  let netPence = 0;

  const producerAmounts = producerOrders.map((po) => {
    const gross = toPence(po.subtotal);
    const commission = Math.round(gross * COMMISSION_RATE);
    const net = gross - commission;
    commissionPence += commission;
    netPence += net;
    return {
      producerId: po.producerId,
      producerName: po.producerName,
      gross: toPounds(gross),
      commission: toPounds(commission),
      net: toPounds(net),
    };
  });

  if (netPence + commissionPence !== toPence(orderTotal)) {
    throw new Error(
      `Producer amounts (£${toPounds(netPence)}) plus commission (£${toPounds(commissionPence)}) ` +
        `do not equal the order total (£${round2(orderTotal)})`
    );
  }

  return { producerAmounts, marketplaceCommission: toPounds(commissionPence) };
}

// notify-producer (US9). Builds the message for one producer: only their items,
// and a required-by date at least 48 hours from now.
function buildProducerNotification(producerOrder, now = Date.now()) {
  const requiredBy = new Date(now + LEAD_TIME_HOURS * 60 * 60 * 1000).toISOString();
  const lines = producerOrder.items
    .filter((i) => i.producerId === producerOrder.producerId)
    .map((i) => `${i.quantity} x ${i.productName}`);
  return {
    producerId: producerOrder.producerId,
    producerOrderId: producerOrder.producerOrderId,
    requiredBy,
    text:
      `New order ${producerOrder.producerOrderId} for ${producerOrder.producerName}: ` +
      `${lines.join(', ')}. Required by ${requiredBy}.`,
  };
}

module.exports = {
  COMMISSION_RATE,
  COMMISSION_MODEL,
  LEAD_TIME_HOURS,
  round2,
  createOrder,
  splitOrderByProducer,
  reduceStock,
  calculateCommission,
  buildProducerNotification,
};
