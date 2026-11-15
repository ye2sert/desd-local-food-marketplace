// Checkout logic for the Checkout & Stock Validation service tasks (PW3 / SCRUM-19).
// AI-assisted code; reviewed and understood by the team.

// Money is handled in whole pence so totals never pick up floating-point errors (e.g. 0.1 + 0.2).
const toPence = (pounds) => Math.round(pounds * 100);
const toPounds = (pence) => pence / 100;

const FALLBACK_DELIVERY = 'Collection from producer';

// identify-producers: group the basket by producer, keeping the order producers first appear in.
function identifyProducers(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('The basket has no items');
  }
  const byProducer = new Map();
  for (const item of items) {
    if (!byProducer.has(item.producerId)) {
      byProducer.set(item.producerId, {
        producerId: item.producerId,
        producerName: item.producerName,
        items: [],
        subtotalPence: 0,
      });
    }
    const order = byProducer.get(item.producerId);
    order.items.push(item);
    order.subtotalPence += toPence(item.unitPrice) * item.quantity;
  }
  return [...byProducer.values()].map(({ subtotalPence, ...order }) => ({
    ...order,
    subtotal: toPounds(subtotalPence),
  }));
}

// determine-delivery: add each producer's delivery or collection option and work out the order total.
function determineDelivery(producerOrders, producers) {
  if (!Array.isArray(producerOrders) || producerOrders.length === 0) {
    throw new Error('There are no producer orders to arrange delivery for');
  }
  const withDelivery = producerOrders.map((order) => ({
    ...order,
    deliveryMethod: producers[order.producerId]?.deliveryMethod ?? FALLBACK_DELIVERY,
  }));
  const totalPence = withDelivery.reduce((sum, order) => sum + toPence(order.subtotal), 0);
  return { producerOrders: withDelivery, orderTotal: toPounds(totalPence) };
}

// notify-stock-issue: one customer-friendly line per stock problem found by check-stock.
function stockIssueMessages(stockIssues) {
  return (stockIssues ?? []).map((issue) => {
    const name = issue.productName ?? issue.productId;
    switch (issue.reason) {
      case 'INSUFFICIENT_STOCK':
        return `${name}: only ${issue.available} left, you asked for ${issue.requested}`;
      case 'OUT_OF_STOCK':
        return `${name}: out of stock`;
      case 'OUT_OF_SEASON':
        return `${name}: out of season, not available at the moment`;
      case 'NOT_FOUND':
        return `${name}: no longer available`;
      default:
        return `${name}: not available in the quantity requested`;
    }
  });
}

const CHECKOUT_FAILED_MESSAGE = "Sorry, we can't check stock right now. Please try again later.";

module.exports = {
  identifyProducers,
  determineDelivery,
  stockIssueMessages,
  CHECKOUT_FAILED_MESSAGE,
  FALLBACK_DELIVERY,
};
