
const { Camunda8 } = require('@camunda8/sdk');

const camunda = new Camunda8({
  ZEEBE_GRPC_ADDRESS: 'grpc://localhost:26500',
  ZEEBE_REST_ADDRESS: 'http://localhost:8080',
  CAMUNDA_AUTH_STRATEGY: 'NONE'
});

const zeebe = camunda.getZeebeGrpcApiClient();

console.log('Starting inform-stock-issue worker...');

zeebe.createWorker({
  taskType: 'inform-stock-issue',
  taskHandler: async (job) => {
    const { items = [], stockIssues = [] } = job.variables;

    console.log('Stock issue detected!');
    console.log('Items:', items);
    console.log('Stock issues:', stockIssues);

    // Simulate notifying the customer
    console.log('Customer notified of stock issue.');

    return job.complete({
      customerNotified: true,
      notificationMessage: 'Some items are out of stock.'
    });
  }
});

console.log('Worker listening for inform-stock-issue jobs...');
