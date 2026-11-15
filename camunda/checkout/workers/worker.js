// Job workers for the Checkout & Stock Validation service tasks (PW3 / SCRUM-19).
// AI-assisted code; reviewed and understood by the team.
// check-stock is handled separately by the stock service (US2).

const fs = require('node:fs');
const path = require('node:path');
const { Camunda8 } = require('@camunda8/sdk');
const {
  identifyProducers,
  determineDelivery,
  stockIssueMessages,
  CHECKOUT_FAILED_MESSAGE,
} = require('./checkout');

const PRODUCERS_FILE = path.join(__dirname, '..', '..', 'shared', 'producers.json');

const camunda = new Camunda8({
  ZEEBE_GRPC_ADDRESS: 'grpc://localhost:26500',
  CAMUNDA_AUTH_STRATEGY: 'NONE',
});

const zeebe = camunda.getZeebeGrpcApiClient();

// Fail the job without retries so a data problem shows up as an incident in Operate.
function failJob(job, error) {
  console.error(`Job ${job.key} (${job.type}) failed: ${error.message}`);
  return job.fail({ errorMessage: error.message, retries: 0 });
}

zeebe.createWorker({
  taskType: 'identify-producers',
  taskHandler: (job) => {
    try {
      const producerOrders = identifyProducers(job.variables.items);
      console.log(`Basket ${job.variables.basketId}: ${producerOrders.length} producer(s) involved`);
      return job.complete({ producerOrders });
    } catch (error) {
      return failJob(job, error);
    }
  },
});

zeebe.createWorker({
  taskType: 'determine-delivery',
  taskHandler: (job) => {
    try {
      const producers = JSON.parse(fs.readFileSync(PRODUCERS_FILE, 'utf8'));
      const result = determineDelivery(job.variables.producerOrders, producers);
      console.log(`Basket ${job.variables.basketId}: order total £${result.orderTotal.toFixed(2)}`);
      return job.complete(result);
    } catch (error) {
      return failJob(job, error);
    }
  },
});

zeebe.createWorker({
  taskType: 'notify-stock-issue',
  taskHandler: (job) => {
    const messages = stockIssueMessages(job.variables.stockIssues);
    console.log(`Basket ${job.variables.basketId} – stock issues for the customer:`);
    messages.forEach((line) => console.log(`  - ${line}`));
    return job.complete();
  },
});

zeebe.createWorker({
  taskType: 'notify-checkout-failed',
  taskHandler: (job) => {
    console.log(`Basket ${job.variables.basketId} – ${CHECKOUT_FAILED_MESSAGE}`);
    return job.complete();
  },
});

console.log('Checkout workers running – waiting for identify-producers, determine-delivery, notify-stock-issue and notify-checkout-failed jobs...');
