// Simulated payment service for PW5 / US6.
// Completes "request-payment" jobs from the payment process.
// AI-assisted code; reviewed and understood by the team.

const { Camunda8 } = require('@camunda8/sdk');
const { decidePayment } = require('./payment');

const camunda = new Camunda8({
  ZEEBE_GRPC_ADDRESS: 'grpc://localhost:26500',
  CAMUNDA_AUTH_STRATEGY: 'NONE',
});

const zeebe = camunda.getZeebeGrpcApiClient();

zeebe.createWorker({
  taskType: 'request-payment',
  taskHandler: (job) => {
    const amount = job.variables.amount ?? 0;
    const result = decidePayment(amount);
    console.log(`Payment of £${amount} for job ${job.key}: ${result.paymentStatus}`);
    return job.complete(result);
  },
});

console.log('Payment service worker running – waiting for request-payment jobs...');
