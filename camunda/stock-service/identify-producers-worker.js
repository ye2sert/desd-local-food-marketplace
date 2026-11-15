
const { Camunda8 } = require("@camunda8/sdk");

const camunda = new Camunda8({
  ZEEBE_GRPC_ADDRESS: "grpc://localhost:26500",
  ZEEBE_REST_ADDRESS: "http://localhost:8080"
});

const zeebe = camunda.getZeebeGrpcApiClient();

// Example producer directory
const producers = {
  "PRD-101": "Local Apple Farm",
  "PRD-102": "Local Dairy Farm",
  "PRD-201": "Regional Food Producer",
  "PRD-202": "Local Vegetable Farm",
  "PRD-301": "Regional Supplier"
};

console.log("Starting identify-producers worker...");

zeebe.createWorker({
  taskType: "identify-producers",
  taskHandler: async (job) => {
    const items = job.variables.items || [];

    console.log("Identifying producers for:", items);

    const producersInvolved = items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      producer: producers[item.productId] || "Unknown producer"
    }));

    console.log("Producers identified:", producersInvolved);

    return job.complete({
      producersInvolved,
      producersIdentified: true
    });
  }
});

console.log("Worker listening for identify-producers jobs...");
