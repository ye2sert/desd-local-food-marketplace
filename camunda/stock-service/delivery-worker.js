
const { Camunda8 } = require("@camunda8/sdk");

const camunda = new Camunda8({
  ZEEBE_GRPC_ADDRESS: "grpc://localhost:26500",
  ZEEBE_REST_ADDRESS: "http://localhost:8080"
});

const zeebe = camunda.getZeebeGrpcApiClient();

console.log("Starting delivery worker...");

zeebe.createWorker({
  taskType: "determine-delivery",

  taskHandler: async (job) => {
    const items = job.variables.items || [];

    console.log("Processing delivery for:", items);

    // Simple demonstration rule
    const totalQuantity = items.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );

    const deliveryMethod =
      totalQuantity >= 10 ? "Delivery" : "Collection";

    console.log("Delivery method:", deliveryMethod);

    return job.complete({
      deliveryMethod,
      deliveryArranged: true
    });
  }
});

console.log("Worker listening for determine-delivery jobs...");
