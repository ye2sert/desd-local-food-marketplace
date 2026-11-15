
const { Camunda8 } = require('@camunda8/sdk');
const { checkStock } = require('./worker.js');

const camunda = new Camunda8({
  ZEEBE_GRPC_ADDRESS: 'grpc://localhost:26500',
  ZEEBE_REST_ADDRESS: 'http://localhost:8080',
  CAMUNDA_AUTH_STRATEGY: 'NONE'
});

const zeebe = camunda.getZeebeGrpcApiClient();

console.log('Starting check-stock worker...');

zeebe.createWorker({
  taskType: 'check-stock',
  taskHandler: async (job) => {
    console.log('Received stock-check job:', job.key);

    const items = job.variables.items || [];
    const result = checkStock(items);

    console.log('Stock check result:', result);

    return job.complete(result);
  }
});

console.log('Worker listening for check-stock jobs...');
