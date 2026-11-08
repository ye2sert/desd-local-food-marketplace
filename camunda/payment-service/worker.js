// Simulated payment service for PW5 / US6.
// Picks up "payment-service" jobs from Camunda and returns a payment result.
// Written with AI assistance; reviewed and understood by the team.

const { Camunda8 } = require('@camunda8/sdk');

const camunda = new Camunda8({
  ZEEBE_GRPC_ADDRESS: 'grpc://localhost:26500',
  CAMUNDA_AUTH_STRATEGY: 'NONE',
  CAMUNDA_SECURE_CONNECTION: false,
});

const zeebe = camunda.getZeebeGrpcApiClient();

zeebe.createWorker({
  taskType: 'payment-service',
  taskHandler: (job) => {
    const amount = job.variables.amount ?? 0;
    console.log(`Processing payment of £${amount} for job ${job.key}`);

    // Sprint 2: always succeed. Sprint 3 will add "declined" and timeouts.
    return job.complete({
      paymentStatus: 'success',
      transactionId: `TXN-${Date.now()}`,
    });
  },
});

console.log('Payment service worker running – waiting for jobs...');

AI was used in an assistive role throughout this document. It was reviewed by our team and changes were made.
