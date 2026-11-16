# desd-local-food-marketplace

UFCFTR-30-3 Distributed and Enterprise Software Development – Task 1
Bristol Regional Food Network – Digital Marketplace

**Project board (Jira):** https://live-team-oq9nzy44.atlassian.net/jira/software/projects/SCRUM/boards/1
**Current sprint:** Sprint 2 – i* models, operational BPMN and initial Camunda automation (30 Oct – 19 Nov 2026)

*Jira access is by invitation. Viewer access has been granted to the module team (Kun Wei, Khoa Phung and Dilshan Jayatilake).*

## Use case

**Use Case 2: Customer Multi-Vendor Order, Checkout and Payment.**
A customer buys products from one or more local producers in a single order. The system checks stock, processes payment through a simulated payment service, updates inventory, notifies producers and calculates the marketplace's 5% commission.

## Proposed functionalities

1. **Checkout & Stock Validation** – covers the multi-vendor basket, stock checks at checkout, amending orders when stock is insufficient, grouping by producer with delivery or collection arrangements, and order confirmation.
2. **Payment & Order Processing** – covers payment through a simulated external service, declined payments with retry, payment service unavailability, splitting the order by producer, inventory updates, producer notification and the 5% commission.

## Team

| Member | Role |
|---|---|
| Hamza | Strategic BPMN & integration |
| Tahmid | Business analysis & stock service |
| Yunus | Checkout & Stock Validation |
| Mackenzie | Payment & Order Processing |
| Rohan | Product owner / project management, payment service |

## Repository structure

| Folder | Contents |
|---|---|
| `bpmn/` | Strategic BPMN models (Sprint 1 and Sprint 2) and an early checkout draft |
| `istar/` | i* Strategic Dependency (SD) and Strategic Rationale (SR) models |
| `camunda/checkout/` | Checkout & Stock Validation process, review form, test data and workers |
| `camunda/payment/` | Payment & Order Processing process, payment form and workers |
| `camunda/payment-service/` | Simulated payment service worker (`request-payment`) |
| `camunda/stock-service/` | Stock check service worker (`check-stock`) |
| `camunda/shared/` | Data shared by the workers: stock levels (`stock.json`, read by the stock service) and producer delivery methods. Payment's stock update still uses its own copy until this is unified in Sprint 3 |
| `camunda/evidence/` | Screenshots and data showing the processes running, one folder per owner |
| `docs/` | Stakeholder, business process and functionality scope documents |
| `project-management/` | Sprint plans and Jira screenshots |

## Running locally

We use **Camunda 8** for process automation. To run the processes on your own machine:

### 1. Start Camunda
1. Install **Java 21**.
2. Download **Camunda 8 Run 8.10.9** for your OS ([download page](https://docs.camunda.io/docs/self-managed/quickstart/developer-quickstart/c8run/install-start/)) and extract it.
3. In the extracted `c8run-8.10.9` folder, start Camunda with `./start.sh` (Windows: `.\c8run.exe start`). Stop it with `./shutdown.sh` (Windows: `.\c8run.exe stop`).
4. Open **Operate** at http://localhost:8080/operate and **Tasklist** at http://localhost:8080/tasklist. Log in with `demo` / `demo`.

### 2. Open and deploy processes
1. Install **Camunda Desktop Modeler 5.52.0** ([download page](https://camunda.com/download/modeler/)).
2. Open a `.bpmn` or `.form` file from the `camunda/` folder.
3. Click the **rocket icon** to deploy to the local **c8run** cluster (authentication: None), then the **play icon** to start an instance.

### 3. Start the workers
Install **Node.js**, then start each worker in its own terminal from the repository root:

| Worker | Commands |
|---|---|
| Stock service | `cd camunda/stock-service && npm install && node camunda-worker.js` |
| Checkout workers | `cd camunda/checkout/workers && npm install && node worker.js` |
| Payment service | `cd camunda/payment-service && npm install && node worker.js` |
| Payment & order processing workers | `cd camunda/payment/workers && npm install && node worker.js` |

Leave all four running.

### 4. Run the whole flow
1. Deploy `camunda/checkout/checkout-stock-validation.bpmn` and `camunda/checkout/review-order.form`.
2. Deploy `camunda/payment/payment-order-processing.bpmn` and `camunda/payment/enter-payment-details.form`.
3. Start the checkout process with the variables in `camunda/checkout/test-data/sample-basket.json`.
4. In Tasklist, open **Review and confirm order**, tick the confirmation box and complete the task. The instance ends at **Order ready for payment**.
5. In Operate, open the finished checkout instance and click **Copy variables**.
6. Start the payment process with those variables.
7. In Tasklist, open **Enter payment details**, choose a payment method, keep the sandbox token and complete the task.
8. The payment instance completes in Operate with `paymentStatus`, `transactionId`, `producerAmounts` and `marketplaceCommission`.

In Sprint 2 the two processes are not yet linked, so payment is started by hand (step 6). Linking them is planned for Sprint 3. See [`camunda/evidence/full-run/`](camunda/evidence/full-run/) for a recorded run.

`camunda/payment-service/payment-test.bpmn` is a small test process for the payment service on its own and is not part of the full flow.

### 5. Run the unit tests
From the repository root:
```bash
(cd camunda/checkout/workers && node --test)
(cd camunda/payment/workers && node --test)
(cd camunda/payment-service && node --test)
```
The stock service does not have unit tests yet.

## Key documents

- [Sprint 1 plan](project-management/sprint-1-plan.md)
- [Sprint 2 plan](project-management/sprint-2-plan.md)
- [Product backlog (Jira)](https://live-team-oq9nzy44.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog)
- [Camunda evidence](camunda/evidence/)

*AI was used in an assistive role throughout this document. It was reviewed by our team and changes were made.*
