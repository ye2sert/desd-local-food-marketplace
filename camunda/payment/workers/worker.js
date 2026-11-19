// Camunda job workers for Payment & Order Processing (US9, US10), one per job type.
// Written with AI assistance; reviewed and understood by Mackenzie.

const { Camunda8 } = require('@camunda8/sdk');
const logic = require('./logic');
const stockStore = require('./stockStore');

// Same connection settings as camunda/payment-service/worker.js (local c8run).
const camunda = new Camunda8({
  ZEEBE_GRPC_ADDRESS: 'grpc://localhost:26500',
  CAMUNDA_AUTH_STRATEGY: 'NONE',
});

const zeebe = camunda.getZeebeGrpcApiClient();

zeebe.createWorker({
  taskType: 'create-order',
  taskHandler: (job) => {
    const order = logic.createOrder();
    console.log(`[create-order] ${order.orderId} for customer ${job.variables.customerId}`);
    return job.complete(order);
  },
});

zeebe.createWorker({
  taskType: 'split-order-by-producer',
  taskHandler: (job) => {
    const producerOrders = logic.splitOrderByProducer(job.variables);
    console.log(`[split-order-by-producer] ${job.variables.orderId}: ${producerOrders.length} producer order(s)`);
    return job.complete({ producerOrders });
  },
});

zeebe.createWorker({
  taskType: 'send-order-confirmation',
  taskHandler: (job) => {
    const { orderId, customerId, orderTotal } = job.variables;
    console.log(`[send-order-confirmation] Order ${orderId} confirmed for ${customerId}, total £${orderTotal}`);
    return job.complete({ confirmationSent: true });
  },
});

// US9: stock is only reduced here, after payment has succeeded.
// Uses the shared stock file, so the checkout stock check sees the new levels.
zeebe.createWorker({
  taskType: 'update-stock',
  taskHandler: (job) => {
    try {
      const result = logic.reduceStock(stockStore.load(), job.variables.items);
      stockStore.save(result.stock);
      console.log(`[update-stock] ${job.variables.orderId}:`, result.stockUpdates);
      return job.complete({ stockUpdates: result.stockUpdates });
    } catch (err) {
      // Shows as an incident in Operate instead of letting stock go negative.
      return job.fail({ errorMessage: err.message, retries: 0 });
    }
  },
});

// US10
zeebe.createWorker({
  taskType: 'calculate-commission',
  taskHandler: (job) => {
    const { producerOrders, orderTotal, orderId } = job.variables;
    try {
      const result = logic.calculateCommission(producerOrders, orderTotal);
      console.log(`[calculate-commission] ${orderId}: commission £${result.marketplaceCommission} (${logic.COMMISSION_MODEL})`);
      return job.complete(result);
    } catch (err) {
      return job.fail({ errorMessage: err.message, retries: 0 });
    }
  },
});

// US9: multi-instance, so this runs once per entry in producerOrders.
zeebe.createWorker({
  taskType: 'notify-producer',
  taskHandler: (job) => {
    const message = logic.buildProducerNotification(job.variables.producerOrder);
    console.log(`[notify-producer] ${message.text}`);
    return job.complete();
  },
});

// No reply from the payment gateway after the retries. We don't know whether the
// payment went through, so we never treat it as failed: the order is held, an
// administrator checks the payment status, and the customer is told it is pending.
// Sprint 3 will add the full behaviour for these two.
zeebe.createWorker({
  taskType: 'flag-payment-for-admin',
  taskHandler: (job) => {
    console.log(`[flag-payment-for-admin] Order ${job.variables.orderId} held: no reply from the payment gateway after retries – administrator to check payment status`);
    return job.complete({ orderStatus: 'PAYMENT_PENDING' });
  },
});

zeebe.createWorker({
  taskType: 'notify-customer-payment-pending',
  taskHandler: (job) => {
    console.log(`[notify-customer-payment-pending] Customer ${job.variables.customerId} told payment for ${job.variables.orderId} is pending`);
    return job.complete();
  },
});

console.log('Payment & Order Processing workers running – waiting for jobs...');
